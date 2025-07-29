import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { auth, isAdmin, isAdminOrDoctor } from '../middleware/auth';
import { 
  createAppointmentSchema, 
  updateAppointmentSchema, 
  updateAppointmentStatusSchema,
  dateRangeSchema 
} from '../validations/schemas';

const router = Router();
const appointmentController = new AppointmentController();

// Protected routes
router.post('/', auth, appointmentController.createAppointment);
router.get('/my-appointments', auth, appointmentController.getMyAppointments);
router.get('/doctor/:doctorId', auth, appointmentController.getDoctorAppointments);
router.get('/status/:status', auth, appointmentController.getAppointmentsByStatus);
router.get('/date-range', auth, appointmentController.getAppointmentsByDateRange);

// Admin/Doctor routes
router.get('/', auth, isAdminOrDoctor, appointmentController.getAllAppointments);
router.get('/:id', auth, isAdminOrDoctor, appointmentController.getAppointmentById);
router.put('/:id/status', auth, isAdminOrDoctor, appointmentController.updateAppointmentStatus);
router.put('/:id', auth, isAdminOrDoctor, appointmentController.updateAppointment);
router.delete('/:id', auth, isAdmin, appointmentController.deleteAppointment);

export default router; 