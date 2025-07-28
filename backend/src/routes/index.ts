import { Router } from 'express';
import userRoutes from './userRoutes';
import appointmentRoutes from './appointmentRoutes';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './patientRoutes';
import newsRoutes from './newsRoutes';
import vacancyRoutes from './vacancyRoutes';
import messageRoutes from './messageRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// API version info
router.get('/info', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      appointments: '/api/appointments',
      doctors: '/api/doctors',
      patients: '/api/patients',
      news: '/api/news',
      vacancies: '/api/vacancies',
      messages: '/api/messages'
    }
  });
});

// Mount route modules
router.use('/api/auth', userRoutes);
router.use('/api/users', userRoutes);
router.use('/api/appointments', appointmentRoutes);
router.use('/api/doctors', doctorRoutes);
router.use('/api/patients', patientRoutes);
router.use('/api/news', newsRoutes);
router.use('/api/vacancies', vacancyRoutes);
router.use('/api/messages', messageRoutes);

export default router; 