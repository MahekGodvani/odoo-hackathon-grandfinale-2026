import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin', authenticate, authorize(['admin']), dashboardController.getAdminDashboard);
router.get('/hr', authenticate, authorize(['admin', 'hr']), dashboardController.getHrDashboard);
router.get('/employee', authenticate, dashboardController.getEmployeeDashboard);
router.get('/payroll-summary', authenticate, authorize(['admin', 'payroll', 'hr']), dashboardController.getPayrollSummary);
router.get('/attendance-summary', authenticate, authorize(['admin', 'hr', 'payroll']), dashboardController.getAttendanceSummary);
router.get('/stats', authenticate, dashboardController.getDashboardStats);

export default router;
