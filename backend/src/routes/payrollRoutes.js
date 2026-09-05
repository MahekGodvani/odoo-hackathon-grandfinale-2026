import express from 'express';
import payrollController from '../controllers/payrollController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['admin', 'hr', 'payroll']), payrollController.getPayrolls);
router.get('/:id', authenticate, authorize(['admin', 'hr', 'payroll']), payrollController.getPayrollById);
router.get('/employee/:employeeId', authenticate, payrollController.getEmployeePayroll);

router.post('/generate', authenticate, authorize(['admin', 'payroll']), payrollController.generatePayroll);
router.post('/:id/process', authenticate, authorize(['admin', 'payroll']), payrollController.processPayroll);
router.post('/:id/approve', authenticate, authorize(['admin', 'payroll']), payrollController.approvePayroll);
router.put('/:id/pay', authenticate, authorize(['admin', 'payroll']), payrollController.markPayrollPaid);

export default router;
