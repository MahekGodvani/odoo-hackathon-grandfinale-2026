const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/employee/:employeeId', authenticate, contractController.getContractByEmployee);
router.post('/assign', authenticate, authorize(['admin', 'hr']), contractController.assignContract);

module.exports = router;
