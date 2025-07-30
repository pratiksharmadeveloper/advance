import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();
const adminController = new AdminController();

// Public admin routes (no authentication required)
router.post('/login', adminController.adminLogin);

// Protected admin routes (authentication required)
router.use(auth);
router.use(adminAuth); // Additional admin role check

// Admin dashboard and management
router.get('/dashboard', adminController.getAdminDashboard);
router.get('/admins', adminController.getAllAdmins);
router.post('/admins', adminController.createAdmin);
router.put('/admins/:id', adminController.updateAdmin);
router.patch('/admins/:id/deactivate', adminController.deactivateAdmin);
router.patch('/admins/:id/activate', adminController.activateAdmin);

export default router; 