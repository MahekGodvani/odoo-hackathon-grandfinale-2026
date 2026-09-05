import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

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

export default router;
