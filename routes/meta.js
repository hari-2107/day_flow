// routes/meta.js
// Exposes fixed field/dropdown options to the frontend so forms can be
// built dynamically instead of hardcoding values in two places.

const express = require("express");
const {
  ROLES,
  ATTENDANCE_STATUS,
  LEAVE_TYPE,
  LEAVE_STATUS,
  EMPLOYMENT_TYPE,
  GENDER_OPTIONS,
  DOCUMENT_TYPES,
  toOptions,
} = require("../constants/fields");

const router = express.Router();

// GET /api/meta/fields
router.get("/fields", (req, res) => {
  res.json({
    roles: toOptions(ROLES),
    attendanceStatus: toOptions(ATTENDANCE_STATUS),
    leaveType: toOptions(LEAVE_TYPE),
    leaveStatus: toOptions(LEAVE_STATUS),
    employmentType: toOptions(EMPLOYMENT_TYPE),
    gender: GENDER_OPTIONS.map((g) => ({
      value: g,
      label: g.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    })),
    documentTypes: toOptions(DOCUMENT_TYPES),
  });
});

module.exports = router;
