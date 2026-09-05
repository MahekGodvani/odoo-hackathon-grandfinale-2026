import express from 'express';
import roleController from '../controllers/rolePermissionController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/roles', authenticate, roleController.getRoles);
router.post('/roles', authenticate, authorize(['admin']), roleController.createRole);
router.put('/roles/:id', authenticate, authorize(['admin']), roleController.updateRole);
router.delete('/roles/:id', authenticate, authorize(['admin']), roleController.deleteRole);

router.get('/permissions', authenticate, roleController.getPermissions);
router.put('/users/:id/role', authenticate, authorize(['admin']), roleController.updateUserRole);

export default router;
