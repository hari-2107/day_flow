// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const attendanceRoutes = require("./routes/attendance");
const leaveRoutes = require("./routes/leave");
const payrollRoutes = require("./routes/payroll");

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "Dayflow HRMS API is running" });
});

// 3.1 Authentication
app.use("/api/auth", authRoutes);
// 3.3 Profile management
app.use("/api/profile", profileRoutes);
// 3.4 Attendance
app.use("/api/attendance", attendanceRoutes);
// 3.5 Leave / time-off
app.use("/api/leave", leaveRoutes);
// 3.6 Payroll
app.use("/api/payroll", payrollRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Dayflow HRMS API running on http://localhost:${PORT}`);
});
