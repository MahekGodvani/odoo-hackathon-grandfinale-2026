const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/admin', authenticate, authorize(['admin']), dashboardController.getAdminDashboard);
router.get('/hr', authenticate, authorize(['admin', 'hr']), dashboardController.getHrDashboard);
router.get('/employee', authenticate, dashboardController.getEmployeeDashboard);
router.get('/payroll-summary', authenticate, authorize(['admin', 'payroll', 'hr']), dashboardController.getPayrollSummary);
router.get('/attendance-summary', authenticate, authorize(['admin', 'hr', 'payroll']), dashboardController.getAttendanceSummary);
router.get('/stats', authenticate, dashboardController.getDashboardStats);

module.exports = router;
