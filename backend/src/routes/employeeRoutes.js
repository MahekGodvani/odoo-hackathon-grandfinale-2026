const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, employeeController.getAllEmployees);
router.get('/:id', authenticate, employeeController.getEmployeeById);
router.post('/', authenticate, authorize(['admin', 'hr']), employeeController.createEmployee);
router.put('/:id', authenticate, authorize(['admin', 'hr']), employeeController.updateEmployee);
router.delete('/:id', authenticate, authorize(['admin', 'hr']), employeeController.deleteEmployee);

module.exports = router;
