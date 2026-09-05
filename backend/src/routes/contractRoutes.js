import express from 'express';
import contractController from '../controllers/contractController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, contractController.getAllContracts);
router.get('/employee/:employeeId', authenticate, contractController.getContractByEmployee);
router.get('/:id', authenticate, contractController.getContractById);

router.post('/assign', authenticate, authorize(['admin', 'hr']), contractController.assignContract);
router.post('/', authenticate, authorize(['admin', 'hr']), contractController.assignContract);
router.put('/:id', authenticate, authorize(['admin', 'hr']), contractController.updateContract);

export default router;

