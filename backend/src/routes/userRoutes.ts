import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { UploadMiddleware } from '../middleware/upload';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(auth);

// User profile routes with avatar upload
router.get('/profile', userController.getProfile);
router.put('/profile', UploadMiddleware.avatarUpload('profileImage'), userController.updateProfile);

// Admin routes (if needed)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

export default router; 