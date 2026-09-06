import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate, optionalAuthenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Registration & Auth Endpoints
router.post('/register', optionalAuthenticate, authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Logout
router.post('/logout', optionalAuthenticate, authController.logout);

// Authenticated User Endpoints
router.get('/me', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

// User Management (Strictly Admin Only)
router.get('/users', authenticate, authorize(['admin']), authController.getUsers);
router.put('/users/:id/role', authenticate, authorize(['admin']), authController.updateUserRole);
router.put('/users/:id/status', authenticate, authorize(['admin']), authController.toggleUserStatus);

export default router;
