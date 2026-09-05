import express from 'express';
import payslipController from '../controllers/payslipController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, payslipController.getPayslips);
router.get('/:id', authenticate, payslipController.getPayslipById);
router.get('/employee/:employeeId', authenticate, payslipController.getEmployeePayslips);
router.get('/:id/download', authenticate, payslipController.downloadPayslip);
router.post('/:id/send', authenticate, authorize(['admin', 'payroll', 'hr']), payslipController.sendPayslip);

export default router;
