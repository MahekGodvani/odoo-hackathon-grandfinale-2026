import express from 'express';
import contractController from '../controllers/contractController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/employee/:employeeId', authenticate, contractController.getContractByEmployee);
router.post('/assign', authenticate, authorize(['admin', 'hr']), contractController.assignContract);

export default router;
