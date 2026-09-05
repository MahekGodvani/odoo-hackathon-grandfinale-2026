const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth');

// Public Auth Endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Logout
router.post('/logout', optionalAuthenticate, authController.logout);

// Authenticated Endpoints
router.get('/me', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
