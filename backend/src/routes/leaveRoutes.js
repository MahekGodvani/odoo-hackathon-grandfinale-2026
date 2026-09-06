import express from 'express';
import leaveController from '../controllers/leaveController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, leaveController.getLeaveRequests);
router.get('/:id', authenticate, leaveController.getLeaveById);
router.post('/', authenticate, leaveController.submitLeaveRequest);
router.put('/:id', authenticate, leaveController.updateLeave);
router.post('/:id/approve', authenticate, authorize(['hr_manager']), leaveController.approveLeave);
router.post('/:id/reject', authenticate, authorize(['hr_manager']), leaveController.rejectLeave);
router.delete('/:id', authenticate, leaveController.deleteLeave);

export default router;
