const express = require('express');
const router = express.Router();
const bankPaymentController = require('../controllers/bankPaymentController');
const { authenticate, authorize } = require('../middlewares/auth');

// Bank Accounts
router.post('/bank-accounts', authenticate, bankPaymentController.createBankAccount);
router.get('/bank-accounts/:employeeId', authenticate, bankPaymentController.getBankAccountsByEmployee);
router.put('/bank-accounts/:id', authenticate, bankPaymentController.updateBankAccount);

// Payments
router.post('/payments', authenticate, authorize(['admin', 'payroll']), bankPaymentController.recordPayment);
router.get('/payments', authenticate, authorize(['admin', 'payroll', 'hr']), bankPaymentController.getPayments);
router.get('/payments/:id', authenticate, bankPaymentController.getPaymentById);

module.exports = router;
