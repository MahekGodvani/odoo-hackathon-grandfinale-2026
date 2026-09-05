import express from 'express';
import salaryController from '../controllers/salaryController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, salaryController.getSalaries);
router.get('/:employeeId', authenticate, salaryController.getSalaryByEmployeeId);
router.post('/', authenticate, authorize(['admin', 'hr', 'payroll']), salaryController.createSalary);
router.put('/:id', authenticate, authorize(['admin', 'hr', 'payroll']), salaryController.updateSalary);
router.delete('/:id', authenticate, authorize(['admin', 'hr', 'payroll']), salaryController.deleteSalary);

export default router;
