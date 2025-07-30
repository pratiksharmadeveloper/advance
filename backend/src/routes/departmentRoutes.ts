import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { UploadMiddleware } from '../middleware/upload';

const router = Router();
const departmentController = new DepartmentController();

// Public routes (no authentication required)
router.get('/active', departmentController.getActiveDepartments);

// Protected routes (authentication required)
router.use(adminAuth);

// Department CRUD operations
router.post('/', UploadMiddleware.departmentImageUpload('image'), departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.put('/:id', UploadMiddleware.departmentImageUpload('image'), departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

export default router; 