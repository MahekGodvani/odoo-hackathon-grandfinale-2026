import express from 'express';
import leaveController from '../controllers/leaveController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, leaveController.getLeaveRequests);
router.get('/:id', authenticate, leaveController.getLeaveById);
router.post('/', authenticate, leaveController.submitLeaveRequest);
router.put('/:id', authenticate, leaveController.updateLeave);
router.post('/:id/approve', authenticate, authorize(['admin', 'hr']), leaveController.approveLeave);
router.post('/:id/reject', authenticate, authorize(['admin', 'hr']), leaveController.rejectLeave);
router.delete('/:id', authenticate, leaveController.deleteLeave);

export default router;
