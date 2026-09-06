import express from 'express';
import reportsController from '../controllers/reportsController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/payroll', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), reportsController.getPayrollReport);
router.get('/attendance', authenticate, authorize(['hr_manager']), reportsController.getAttendanceReport);
router.get('/leave', authenticate, authorize(['hr_manager']), reportsController.getLeaveReport);
router.get('/salary', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), reportsController.getSalaryReport);
router.get('/tax', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), reportsController.getTaxReport);
router.get('/export', authenticate, authorize(['hr_manager']), reportsController.exportReports);

export default router;
