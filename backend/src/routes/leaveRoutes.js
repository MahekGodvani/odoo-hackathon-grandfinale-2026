const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, leaveController.getLeaveRequests);
router.get('/:id', authenticate, leaveController.getLeaveById);
router.post('/', authenticate, leaveController.submitLeaveRequest);
router.put('/:id', authenticate, leaveController.updateLeave);
router.post('/:id/approve', authenticate, authorize(['admin', 'hr']), leaveController.approveLeave);
router.post('/:id/reject', authenticate, authorize(['admin', 'hr']), leaveController.rejectLeave);
router.delete('/:id', authenticate, leaveController.deleteLeave);

module.exports = router;
