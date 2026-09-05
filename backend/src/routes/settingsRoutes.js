import express from 'express';
import settingsController from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/settings', authenticate, settingsController.getSettings);
router.put('/settings', authenticate, authorize(['admin']), settingsController.updateSettings);

router.get('/company/settings', authenticate, settingsController.getCompanySettings);
router.put('/company/settings', authenticate, authorize(['admin']), settingsController.updateCompanySettings);

export default router;
