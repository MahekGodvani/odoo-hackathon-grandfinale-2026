const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, notificationController.getNotifications);
router.put('/:id/read', authenticate, notificationController.markNotificationRead);
router.post('/send', authenticate, authorize(['admin', 'hr']), notificationController.sendNotification);

module.exports = router;
