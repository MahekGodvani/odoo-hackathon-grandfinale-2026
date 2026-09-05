const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, companyController.getCompanies);
router.get('/:id', authenticate, companyController.getCompanyById);
router.post('/', authenticate, authorize(['admin']), companyController.createCompany);
router.put('/:id', authenticate, authorize(['admin']), companyController.updateCompany);
router.delete('/:id', authenticate, authorize(['admin']), companyController.deleteCompany);

module.exports = router;
