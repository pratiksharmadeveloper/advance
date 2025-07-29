import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { auth, isAdmin } from '../middleware/auth';
import { registerSchema, loginSchema, updateProfileSchema } from '../validations/schemas';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Admin only routes
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, isAdmin, userController.getUserById);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

export default router; 