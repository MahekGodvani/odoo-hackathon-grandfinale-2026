const express = require('express');
const router = express.Router();
const payslipController = require('../controllers/payslipController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, payslipController.getPayslips);
router.get('/:id', authenticate, payslipController.getPayslipById);

module.exports = router;
