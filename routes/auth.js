// routes/auth.js
// 3.1 Authentication & Authorization

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { sendOtpEmail } = require("../utils/mailer");
const { ROLES } = require("../constants/fields");

const router = express.Router();

// Basic password rule: min 8 chars, at least one letter and one number
function isPasswordValid(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

// Generates a 6-digit numeric OTP as a string, e.g. "042917"
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// -------------------------------------------------
// POST /api/auth/signup
// body: { employee_id, email, password, role, full_name }
// -------------------------------------------------
router.post("/signup", async (req, res) => {
  const { employee_id, email, password, role, full_name } = req.body;

  if (!employee_id || !email || !password || !role || !full_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${Object.values(ROLES).join(", ")}` });
  }
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters and include a letter and a number",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const userResult = await client.query(
      `INSERT INTO users (employee_id, email, password_hash, role, otp_code, otp_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, employee_id, email, role, created_at`,
      [employee_id, email, passwordHash, role, otp, otpExpiresAt]
    );

    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO employee_profiles (user_id, full_name) VALUES ($1, $2)`,
      [user.id, full_name]
    );

    await client.query("COMMIT");

    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: "Signup successful. Enter the OTP sent to your email to verify your account.",
      user,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      return res.status(409).json({ error: "Employee ID or email already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  } finally {
    client.release();
  }
});

// -------------------------------------------------
// POST /api/auth/verify-otp
// body: { email, otp }
// -------------------------------------------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ error: "No account found for that email" });
    if (user.is_email_verified) return res.status(400).json({ error: "Email already verified" });

    if (!user.otp_code || user.otp_code !== otp) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }
    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    await pool.query(
      `UPDATE users SET is_email_verified = TRUE, otp_code = NULL, otp_expires_at = NULL
       WHERE id = $1`,
      [user.id]
    );

    res.json({ message: "Email verified successfully. You can now sign in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP verification failed" });
  }
});

// -------------------------------------------------
// POST /api/auth/resend-otp
// body: { email }
// -------------------------------------------------
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ error: "No account found for that email" });
    if (user.is_email_verified) return res.status(400).json({ error: "Email already verified" });

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE id = $3`,
      [otp, otpExpiresAt, user.id]
    );

    await sendOtpEmail(email, otp);

    res.json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

// -------------------------------------------------
// POST /api/auth/signin
// body: { email, password }
// -------------------------------------------------
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.is_email_verified) {
      return res.status(403).json({ error: "Please verify your email before signing in" });
    }

    const token = jwt.sign(
      { id: user.id, employee_id: user.employee_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sign in failed" });
  }
});

module.exports = router;