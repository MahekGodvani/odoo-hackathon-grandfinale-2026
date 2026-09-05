const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, leaveController.getLeaveRequests);
router.post('/apply', authenticate, leaveController.submitLeaveRequest);
router.put('/:id/status', authenticate, authorize(['admin', 'hr']), leaveController.updateLeaveStatus);

module.exports = router;
