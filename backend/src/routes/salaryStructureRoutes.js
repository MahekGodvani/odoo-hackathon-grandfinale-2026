import { Router } from 'express';
import { 
  getSalaryStructures, 
  createSalaryStructure, 
  updateSalaryStructure, 
  getSalaryRules, 
  createSalaryRule, 
  updateSalaryRule 
} from '../controllers/salaryStructureController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Enforce authentication across all salary structure & rule endpoints
router.use(authenticate);

// Salary Structures management
// HR Payroll User & HR Payroll Manager can view; HR Payroll Manager has full CRUD; HR Manager has no access
router.get('/structures', authorize(['hr_payroll_user', 'hr_payroll_manager']), getSalaryStructures);
router.post('/structures', authorize(['hr_payroll_manager']), createSalaryStructure);
router.put('/structures/:id', authorize(['hr_payroll_manager']), updateSalaryStructure);

// Salary Rules & Calculation Formulas
// HR Payroll User has read-only access; HR Payroll Manager manages formula definitions
router.get('/rules', authorize(['hr_payroll_user', 'hr_payroll_manager']), getSalaryRules);
router.post('/rules', authorize(['hr_payroll_manager']), createSalaryRule);
router.put('/rules/:id', authorize(['hr_payroll_manager']), updateSalaryRule);

export default router;
