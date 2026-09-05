import express from 'express';
import companyController from '../controllers/companyController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, companyController.getCompanies);
router.get('/:id', authenticate, companyController.getCompanyById);
router.post('/', authenticate, authorize(['admin']), companyController.createCompany);
router.put('/:id', authenticate, authorize(['admin']), companyController.updateCompany);
router.delete('/:id', authenticate, authorize(['admin']), companyController.deleteCompany);

export default router;
