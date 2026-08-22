const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/apply', verifyToken, leaveController.applyLeave);
router.get('/my', verifyToken, leaveController.getMyLeaves);
router.get('/', verifyToken, leaveController.getMyLeaves);
router.patch('/:id/status', verifyToken, requireRole('ADMIN'), leaveController.updateLeaveStatus);
router.patch('/:id', verifyToken, requireRole('ADMIN'), leaveController.updateLeaveStatus);

module.exports = router;
