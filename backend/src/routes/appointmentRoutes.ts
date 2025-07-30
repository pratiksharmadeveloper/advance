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

const router = Router();
const appointmentController = new AppointmentController();

// Protected routes
router.post('/', auth, appointmentController.createAppointment);
router.get('/my-appointments', auth, appointmentController.getMyAppointments);

// Admin/Doctor routes
router.get('/', adminAuth, appointmentController.getAllAppointments);
router.get('/:id', adminAuth, appointmentController.getAppointmentById);
router.put('/:id', adminAuth, appointmentController.updateAppointment);
router.delete('/:id', adminAuth, appointmentController.deleteAppointment);

export default router; 