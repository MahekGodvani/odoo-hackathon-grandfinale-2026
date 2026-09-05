import express from 'express';
import notificationController from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, notificationController.getNotifications);
router.put('/:id/read', authenticate, notificationController.markNotificationRead);
router.post('/send', authenticate, authorize(['admin', 'hr']), notificationController.sendNotification);

export default router;
