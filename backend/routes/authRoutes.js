const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Standard specified auth routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/verify-email', authController.verifyEmail);

// Backward compatibility aliases
router.post('/register', authController.signup);
router.post('/login', authController.signin);

module.exports = router;
