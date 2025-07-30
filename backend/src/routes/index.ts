import { Router } from 'express';
import userRoutes from './userRoutes';
import appointmentRoutes from './appointmentRoutes';
import newsRoutes from './newsRoutes';
import vacancyRoutes from './vacancyRoutes';
import messageRoutes from './messageRoutes';
import departmentRoutes from './departmentRoutes';
import adminRoutes from './adminRoutes';

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
      news: '/news',
      vacancies: '/vacancies',
      messages: '/messages',
      departments: '/departments',
      admin: '/admin'
    }
  });
});

// Mount route modules
router.use('/auth', userRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/news', newsRoutes);
router.use('/vacancies', vacancyRoutes);
router.use('/messages', messageRoutes);
router.use('/departments', departmentRoutes);
router.use('/admin', adminRoutes);

export default router; 