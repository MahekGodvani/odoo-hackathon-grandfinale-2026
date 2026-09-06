import { Router } from 'express';
import { 
  getSchedules, 
  getSchedule, 
  createSchedule, 
  updateSchedule 
} from '../controllers/scheduleController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Enforce authentication across all schedule endpoints
router.use(authenticate);

// View work schedules (any authenticated staff)
router.get('/', getSchedules);
router.get('/:id', getSchedule);

// Manage work schedules (HR Manager, inherited by Payroll roles and Admin)
router.post('/', authorize(['hr_manager']), createSchedule);
router.put('/:id', authorize(['hr_manager']), updateSchedule);

export default router;
