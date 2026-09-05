const express = require('express');
const router = express.Router();
const payslipController = require('../controllers/payslipController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, payslipController.getPayslips);
router.get('/:id', authenticate, payslipController.getPayslipById);
router.get('/employee/:employeeId', authenticate, payslipController.getEmployeePayslips);
router.get('/:id/download', authenticate, payslipController.downloadPayslip);
router.post('/:id/send', authenticate, authorize(['admin', 'payroll', 'hr']), payslipController.sendPayslip);

module.exports = router;
