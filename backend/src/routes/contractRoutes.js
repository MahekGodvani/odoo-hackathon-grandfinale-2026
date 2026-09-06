import express from 'express';
import contractController from '../controllers/contractController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize(['hr_manager']), contractController.getAllContracts);
router.get('/employee/:employeeId', authenticate, contractController.getContractByEmployee);
router.get('/:id', authenticate, contractController.getContractById);

router.post('/assign', authenticate, authorize(['hr_manager']), contractController.assignContract);
router.post('/', authenticate, authorize(['hr_manager']), contractController.assignContract);
router.put('/:id', authenticate, authorize(['hr_manager']), contractController.updateContract);

export default router;

