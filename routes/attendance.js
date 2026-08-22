// routes/attendance.js
// 3.4 Attendance Management

const express = require("express");
const pool = require("../db");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// -------------------------------------------------
// POST /api/attendance/check-in
// -------------------------------------------------
router.post("/check-in", async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const result = await pool.query(
      `INSERT INTO attendance (user_id, date, check_in, status)
       VALUES ($1, $2, NOW(), 'present')
       ON CONFLICT (user_id, date)
       DO UPDATE SET check_in = NOW()
       RETURNING *`,
      [req.user.id, today]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Check-in failed" });
  }
});

// -------------------------------------------------
// POST /api/attendance/check-out
// -------------------------------------------------
router.post("/check-out", async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const result = await pool.query(
      `UPDATE attendance SET check_out = NOW()
       WHERE user_id = $1 AND date = $2
       RETURNING *`,
      [req.user.id, today]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "You haven't checked in today" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Check-out failed" });
  }
});

// -------------------------------------------------
// GET /api/attendance/me?from=YYYY-MM-DD&to=YYYY-MM-DD
// Employees can view only their own attendance (3.4.2)
// -------------------------------------------------
router.get("/me", async (req, res) => {
  const { from, to } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM attendance
       WHERE user_id = $1
         AND ($2::date IS NULL OR date >= $2)
         AND ($3::date IS NULL OR date <= $3)
       ORDER BY date DESC`,
      [req.user.id, from || null, to || null]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// -------------------------------------------------
// GET /api/attendance/:userId  (Admin - view any employee's attendance)
// -------------------------------------------------
router.get("/:userId", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// -------------------------------------------------
// GET /api/attendance  (Admin - all employees, e.g. for a given date)
// -------------------------------------------------
router.get("/", requireAdmin, async (req, res) => {
  const { date } = req.query;

  try {
    const result = await pool.query(
      `SELECT a.*, p.full_name
       FROM attendance a
       JOIN employee_profiles p ON p.user_id = a.user_id
       WHERE ($1::date IS NULL OR a.date = $1)
       ORDER BY a.date DESC, p.full_name`,
      [date || null]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// -------------------------------------------------
// PATCH /api/attendance/:id  (Admin - manually set status, e.g. mark Absent/Half-day)
// -------------------------------------------------
router.patch("/:id", requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!["present", "absent", "half-day", "leave"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const result = await pool.query(
      `UPDATE attendance SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

module.exports = router;
