import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { auth, isAdmin, isAdminOrDoctor } from '../middleware/auth';
import { 
  createAppointmentSchema, 
  updateAppointmentSchema, 
  updateAppointmentStatusSchema,
  dateRangeSchema 
} from '../validations/schemas';
import { adminAuth } from '../middleware/adminAuth';
import { UploadMiddleware } from '../middleware/upload';

const router = Router();
const appointmentController = new AppointmentController();

// Protected routes
router.post('/', auth, UploadMiddleware.fileOrImageUpload("report", 10 * 1024 * 1024), appointmentController.createAppointment);
router.get('/my-appointments', auth, appointmentController.getMyAppointments);

// Admin/Doctor routes
router.get('/', auth, adminAuth, appointmentController.getAllAppointments);
router.patch('/:id/:status', auth, isAdminOrDoctor, appointmentController.changeAppointmentStatus);
router.get('/:id', auth, adminAuth, appointmentController.getAppointmentById);
router.put('/:id', auth, adminAuth, appointmentController.updateAppointment);
router.delete('/:id', auth, adminAuth, appointmentController.deleteAppointment);

export default router; 