import express from 'express';
import employeeController from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, employeeController.getAllEmployees);
router.get('/:id', authenticate, employeeController.getEmployeeById);
router.post('/', authenticate, authorize(['hr_manager']), employeeController.createEmployee);
router.put('/:id', authenticate, authorize(['hr_manager']), employeeController.updateEmployee);
router.delete('/:id', authenticate, authorize(['hr_manager']), employeeController.deleteEmployee);

export default router;
