// routes/profile.js
// 3.3 Employee Profile Management

const express = require("express");
const pool = require("../db");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// -------------------------------------------------
// GET /api/profile/me
// Employee views their own profile (3.3.1)
// -------------------------------------------------
router.get("/me", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.employee_id, u.email, u.role,
              p.full_name, p.date_of_birth, p.gender, p.phone, p.address,
              p.profile_picture_url, p.department, p.designation,
              p.date_of_joining, p.employment_type
       FROM users u
       JOIN employee_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Profile not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// -------------------------------------------------
// PATCH /api/profile/me
// Employee edits limited fields only: address, phone, profile picture (3.3.2)
// -------------------------------------------------
router.patch("/me", async (req, res) => {
  const { phone, address, profile_picture_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE employee_profiles
       SET phone = COALESCE($1, phone),
           address = COALESCE($2, address),
           profile_picture_url = COALESCE($3, profile_picture_url),
           updated_at = NOW()
       WHERE user_id = $4
       RETURNING *`,
      [phone, address, profile_picture_url, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// -------------------------------------------------
// GET /api/profile/:userId  (Admin only - view any employee)
// -------------------------------------------------
router.get("/:userId", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.employee_id, u.email, u.role, p.*
       FROM users u
       JOIN employee_profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.params.userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employee profile" });
  }
});

// -------------------------------------------------
// PATCH /api/profile/:userId  (Admin can edit ALL fields, per 3.3.2)
// -------------------------------------------------
router.patch("/:userId", requireAdmin, async (req, res) => {
  const {
    full_name, date_of_birth, gender, phone, address, profile_picture_url,
    department, designation, date_of_joining, employment_type,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE employee_profiles SET
         full_name = COALESCE($1, full_name),
         date_of_birth = COALESCE($2, date_of_birth),
         gender = COALESCE($3, gender),
         phone = COALESCE($4, phone),
         address = COALESCE($5, address),
         profile_picture_url = COALESCE($6, profile_picture_url),
         department = COALESCE($7, department),
         designation = COALESCE($8, designation),
         date_of_joining = COALESCE($9, date_of_joining),
         employment_type = COALESCE($10, employment_type),
         updated_at = NOW()
       WHERE user_id = $11
       RETURNING *`,
      [full_name, date_of_birth, gender, phone, address, profile_picture_url,
       department, designation, date_of_joining, employment_type, req.params.userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// -------------------------------------------------
// GET /api/profile  (Admin only - full employee list, for the dashboard)
// -------------------------------------------------
router.get("/", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.employee_id, u.email, u.role, p.full_name, p.department, p.designation
       FROM users u
       JOIN employee_profiles p ON p.user_id = u.id
       ORDER BY p.full_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

module.exports = router;
