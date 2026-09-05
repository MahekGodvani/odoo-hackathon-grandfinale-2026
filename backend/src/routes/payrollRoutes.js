const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize(['admin', 'hr', 'payroll']), payrollController.getPayrolls);
router.post('/generate', authenticate, authorize(['admin', 'payroll']), payrollController.generatePayroll);
router.put('/:id/approve', authenticate, authorize(['admin', 'payroll']), payrollController.approvePayroll);
router.put('/:id/pay', authenticate, authorize(['admin', 'payroll']), payrollController.markPayrollPaid);

module.exports = router;
