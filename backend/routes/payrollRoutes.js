const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/me', verifyToken, payrollController.getMyPayroll);
router.get('/structure', verifyToken, payrollController.getMyPayroll);
router.get('/payslips', verifyToken, payrollController.getMyPayroll);

module.exports = router;
