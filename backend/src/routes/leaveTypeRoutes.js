import { Router } from 'express';
import { 
  getLeaveTypes, 
  createLeaveType, 
  updateLeaveType, 
  getAllocations, 
  createAllocation, 
  updateAllocation 
} from '../controllers/leaveTypeController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Enforce authentication across all leave type and allocation endpoints
router.use(authenticate);

// Leave Types configuration (HR Manager, inherited by Payroll roles and Admin)
router.get('/types', getLeaveTypes);
router.post('/types', authorize(['hr_manager']), createLeaveType);
router.put('/types/:id', authorize(['hr_manager']), updateLeaveType);

// Leave Allocations (Employee reads own; HR Manager manages)
router.get('/allocations', getAllocations);
router.post('/allocations', authorize(['hr_manager']), createAllocation);
router.put('/allocations/:id', authorize(['hr_manager']), updateAllocation);

export default router;
