import { Router } from 'express';
import userRoutes from './userRoutes';
import appointmentRoutes from './appointmentRoutes';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './patientRoutes';
import newsRoutes from './newsRoutes';
import vacancyRoutes from './vacancyRoutes';
import messageRoutes from './messageRoutes';
import departmentRoutes from './departmentRoutes';

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
      auth: '/auth', 
      users: '/users',
      appointments: '/appointments',
      doctors: '/doctors',
      patients: '/patients',
      news: '/news',
      vacancies: '/vacancies',
      messages: '/messages',
      departments: '/departments'
    }
  });
});

// Mount route modules
router.use('/auth', userRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/news', newsRoutes);
router.use('/vacancies', vacancyRoutes);
router.use('/messages', messageRoutes);
router.use('/departments', departmentRoutes);

export default router; 