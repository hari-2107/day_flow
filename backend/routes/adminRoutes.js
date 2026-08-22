const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const payrollController = require('../controllers/payrollController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');


router.use(verifyToken, requireRole('ADMIN'));

router.get('/employees', adminController.getAllEmployees);
router.put('/employees/:id', adminController.updateEmployee);

router.get('/attendance', attendanceController.getAdminAttendance);
router.get('/leaves', leaveController.getAdminLeaves);
router.get('/payroll', payrollController.getAdminPayroll);
router.put('/payroll/:userId', payrollController.updateUserPayroll);

module.exports = router;
