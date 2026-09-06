import express from 'express';
import payrollController from '../controllers/payrollController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Read payruns: HR Payroll User and HR Payroll Manager (Admin auto-passes)
router.get('/', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), payrollController.getPayrolls);
router.get('/eligibility', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), payrollController.getPayrollEligibility);
router.get('/:id', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), payrollController.getPayrollById);
router.get('/employee/:employeeId', authenticate, payrollController.getEmployeePayroll);

// Create & Process payruns: HR Payroll User and HR Payroll Manager
router.post('/generate', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), payrollController.generatePayroll);
router.post('/:id/process', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), payrollController.processPayroll);
router.post('/:id/send', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), payrollController.sendPayrollPayslips);

// Manager Approval & Mark Paid: HR Payroll Manager (and Admin)
router.post('/:id/approve', authenticate, authorize(['hr_payroll_manager']), payrollController.approvePayroll);
router.put('/:id/pay', authenticate, authorize(['hr_payroll_manager']), payrollController.markPayrollPaid);

export default router;

