// routes/leave.js
// 3.5 Leave & Time-Off Management

const express = require("express");
const pool = require("../db");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// -------------------------------------------------
// POST /api/leave
// Employee applies for leave (3.5.1)
// body: { leave_type, start_date, end_date, remarks }
// -------------------------------------------------
router.post("/", async (req, res) => {
  const { leave_type, start_date, end_date, remarks } = req.body;

  if (!leave_type || !start_date || !end_date) {
    return res.status(400).json({ error: "leave_type, start_date and end_date are required" });
  }
  if (!["paid", "sick", "unpaid"].includes(leave_type)) {
    return res.status(400).json({ error: "leave_type must be paid, sick, or unpaid" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, remarks)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, leave_type, start_date, end_date, remarks || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit leave request" });
  }
});

// -------------------------------------------------
// GET /api/leave/me
// Employee views their own leave request history + status
// -------------------------------------------------
router.get("/me", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
});

// -------------------------------------------------
// GET /api/leave  (Admin - view all leave requests, 3.5.2)
// optional ?status=pending|approved|rejected
// -------------------------------------------------
router.get("/", requireAdmin, async (req, res) => {
  const { status } = req.query;

  try {
    const result = await pool.query(
      `SELECT l.*, p.full_name
       FROM leave_requests l
       JOIN employee_profiles p ON p.user_id = l.user_id
       WHERE ($1::text IS NULL OR l.status = $1)
       ORDER BY l.created_at DESC`,
      [status || null]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
});

// -------------------------------------------------
// PATCH /api/leave/:id/review  (Admin approves/rejects + comments, 3.5.2)
// body: { status: 'approved' | 'rejected', admin_comments }
// -------------------------------------------------
router.patch("/:id/review", requireAdmin, async (req, res) => {
  const { status, admin_comments } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "status must be 'approved' or 'rejected'" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const leaveResult = await client.query(
      `UPDATE leave_requests
       SET status = $1, admin_comments = $2, reviewed_by = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [status, admin_comments || null, req.user.id, req.params.id]
    );

    if (leaveResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Leave request not found" });
    }

    const leave = leaveResult.rows[0];

    // Reflect approved leave immediately in attendance records (per spec: "Changes
    // reflect immediately in employee records")
    if (status === "approved") {
      const dates = [];
      let d = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      while (d <= end) {
        dates.push(new Date(d).toISOString().slice(0, 10));
        d.setDate(d.getDate() + 1);
      }

      for (const date of dates) {
        await client.query(
          `INSERT INTO attendance (user_id, date, status)
           VALUES ($1, $2, 'leave')
           ON CONFLICT (user_id, date) DO UPDATE SET status = 'leave'`,
          [leave.user_id, date]
        );
      }
    }

    await client.query("COMMIT");
    res.json(leave);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to review leave request" });
  } finally {
    client.release();
  }
});

module.exports = router;
