import express from 'express';
import reportsController from '../controllers/reportsController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/payroll', authenticate, authorize(['admin', 'payroll', 'hr']), reportsController.getPayrollReport);
router.get('/attendance', authenticate, authorize(['admin', 'hr']), reportsController.getAttendanceReport);
router.get('/leave', authenticate, authorize(['admin', 'hr']), reportsController.getLeaveReport);
router.get('/salary', authenticate, authorize(['admin', 'payroll', 'hr']), reportsController.getSalaryReport);
router.get('/tax', authenticate, authorize(['admin', 'payroll']), reportsController.getTaxReport);
router.get('/export', authenticate, authorize(['admin', 'payroll', 'hr']), reportsController.exportReports);

export default router;
