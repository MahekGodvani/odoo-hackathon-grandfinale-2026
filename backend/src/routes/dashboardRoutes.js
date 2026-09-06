import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin', authenticate, authorize(['admin']), dashboardController.getAdminDashboard);
router.get('/hr', authenticate, authorize(['hr_manager']), dashboardController.getHrDashboard);
router.get('/employee', authenticate, dashboardController.getEmployeeDashboard);
router.get('/payroll-summary', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), dashboardController.getPayrollSummary);
router.get('/attendance-summary', authenticate, authorize(['hr_manager']), dashboardController.getAttendanceSummary);
router.get('/stats', authenticate, dashboardController.getDashboardStats);
router.get('/rankings', authenticate, dashboardController.getTopEmployeeRankings);

export default router;
