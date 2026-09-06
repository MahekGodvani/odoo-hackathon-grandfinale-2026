import express from 'express';
import salaryController from '../controllers/salaryController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['hr_manager', 'hr_payroll_user', 'hr_payroll_manager']), salaryController.getSalaries);
router.get('/:employeeId', authenticate, salaryController.getSalaryByEmployeeId);
router.post('/', authenticate, authorize(['hr_payroll_manager']), salaryController.createSalary);
router.put('/:id', authenticate, authorize(['hr_payroll_manager']), salaryController.updateSalary);
router.delete('/:id', authenticate, authorize(['hr_payroll_manager']), salaryController.deleteSalary);

export default router;
