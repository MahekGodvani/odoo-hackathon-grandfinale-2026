const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middlewares/auth');

// HR & Admin can manage employees; all authenticated users can view their listing if needed
router.get('/', authenticate, employeeController.getAllEmployees);
router.get('/:id', authenticate, employeeController.getEmployeeById);
router.post('/', authenticate, authorize(['admin', 'hr']), employeeController.createEmployee);
router.put('/:id', authenticate, authorize(['admin', 'hr']), employeeController.updateEmployee);

module.exports = router;
