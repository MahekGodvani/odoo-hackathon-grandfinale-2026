const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/payroll', authenticate, authorize(['admin', 'payroll', 'hr']), reportsController.getPayrollReport);
router.get('/attendance', authenticate, authorize(['admin', 'hr']), reportsController.getAttendanceReport);
router.get('/leave', authenticate, authorize(['admin', 'hr']), reportsController.getLeaveReport);
router.get('/salary', authenticate, authorize(['admin', 'payroll', 'hr']), reportsController.getSalaryReport);
router.get('/tax', authenticate, authorize(['admin', 'payroll']), reportsController.getTaxReport);
router.get('/export', authenticate, authorize(['admin', 'payroll', 'hr']), reportsController.exportReports);

module.exports = router;
