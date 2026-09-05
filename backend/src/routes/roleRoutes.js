const express = require('express');
const router = express.Router();
const roleController = require('../controllers/rolePermissionController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/roles', authenticate, roleController.getRoles);
router.post('/roles', authenticate, authorize(['admin']), roleController.createRole);
router.put('/roles/:id', authenticate, authorize(['admin']), roleController.updateRole);
router.delete('/roles/:id', authenticate, authorize(['admin']), roleController.deleteRole);

router.get('/permissions', authenticate, roleController.getPermissions);
router.put('/users/:id/role', authenticate, authorize(['admin']), roleController.updateUserRole);

module.exports = router;
