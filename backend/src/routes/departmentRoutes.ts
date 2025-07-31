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
router.use(auth);

// Department CRUD operations
router.post('/', adminAuth, UploadMiddleware.departmentImageUpload('image'), departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', adminAuth, departmentController.getDepartmentById);
router.put('/:id', adminAuth, UploadMiddleware.departmentImageUpload('image'), departmentController.updateDepartment);
router.delete('/:id', adminAuth, departmentController.deleteDepartment);

export default router; 