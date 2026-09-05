const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, salaryController.getSalaries);
router.get('/:employeeId', authenticate, salaryController.getSalaryByEmployeeId);
router.post('/', authenticate, authorize(['admin', 'hr', 'payroll']), salaryController.createSalary);
router.put('/:id', authenticate, authorize(['admin', 'hr', 'payroll']), salaryController.updateSalary);
router.delete('/:id', authenticate, authorize(['admin', 'hr', 'payroll']), salaryController.deleteSalary);

module.exports = router;
