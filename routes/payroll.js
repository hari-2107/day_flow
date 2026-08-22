// routes/payroll.js
// 3.6 Payroll / Salary Management

const express = require("express");
const pool = require("../db");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// -------------------------------------------------
// GET /api/payroll/me  (Employee - read-only view, 3.6.1)
// -------------------------------------------------
router.get("/me", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, basic_salary, allowances, deductions, net_salary, effective_month
       FROM payroll
       WHERE user_id = $1
       ORDER BY effective_month DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payroll" });
  }
});

// -------------------------------------------------
// GET /api/payroll  (Admin - view payroll of all employees, 3.6.2)
// optional ?month=YYYY-MM-01
// -------------------------------------------------
router.get("/", requireAdmin, async (req, res) => {
  const { month } = req.query;

  try {
    const result = await pool.query(
      `SELECT pr.*, p.full_name
       FROM payroll pr
       JOIN employee_profiles p ON p.user_id = pr.user_id
       WHERE ($1::date IS NULL OR pr.effective_month = $1)
       ORDER BY pr.effective_month DESC, p.full_name`,
      [month || null]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payroll records" });
  }
});

// -------------------------------------------------
// POST /api/payroll  (Admin - create/update salary structure for a month, 3.6.2)
// body: { user_id, basic_salary, allowances, deductions, effective_month }
// -------------------------------------------------
router.post("/", requireAdmin, async (req, res) => {
  const { user_id, basic_salary, allowances, deductions, effective_month } = req.body;

  if (!user_id || basic_salary == null || !effective_month) {
    return res.status(400).json({ error: "user_id, basic_salary and effective_month are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO payroll (user_id, basic_salary, allowances, deductions, effective_month)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, effective_month)
       DO UPDATE SET basic_salary = $2, allowances = $3, deductions = $4
       RETURNING *`,
      [user_id, basic_salary, allowances || 0, deductions || 0, effective_month]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save payroll record" });
  }
});

module.exports = router;
