const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth');

// Public Auth Endpoints
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken); // Invoked when 15-min access token expires
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Logout (can be called with access token or refresh token)
router.post('/logout', optionalAuthenticate, authController.logout);

// Authenticated Endpoints (Requires valid 15-minute access token)
router.get('/me', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
