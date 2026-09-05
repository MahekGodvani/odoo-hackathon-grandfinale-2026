const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/settings', authenticate, settingsController.getSettings);
router.put('/settings', authenticate, authorize(['admin']), settingsController.updateSettings);

router.get('/company/settings', authenticate, settingsController.getCompanySettings);
router.put('/company/settings', authenticate, authorize(['admin']), settingsController.updateCompanySettings);

module.exports = router;
