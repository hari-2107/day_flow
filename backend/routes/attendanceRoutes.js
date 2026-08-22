const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/check-in', verifyToken, attendanceController.checkIn);
router.post('/check-out', verifyToken, attendanceController.checkOut);
router.get('/my', verifyToken, attendanceController.getMyAttendance);
router.get('/logs', verifyToken, attendanceController.getMyAttendance);

module.exports = router;
