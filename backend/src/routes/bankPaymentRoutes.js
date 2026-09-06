import express from 'express';
import bankPaymentController from '../controllers/bankPaymentController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Bank Accounts
router.post('/bank-accounts', authenticate, bankPaymentController.createBankAccount);
router.get('/bank-accounts/:employeeId', authenticate, bankPaymentController.getBankAccountsByEmployee);
router.put('/bank-accounts/:id', authenticate, bankPaymentController.updateBankAccount);

// Payments
router.post('/payments', authenticate, authorize(['hr_payroll_manager']), bankPaymentController.recordPayment);
router.get('/payments', authenticate, authorize(['hr_payroll_user', 'hr_payroll_manager']), bankPaymentController.getPayments);
router.get('/payments/:id', authenticate, bankPaymentController.getPaymentById);

export default router;
