import { Router } from 'express';

const router = Router();

// TODO: Implement doctor routes
router.get('/', (req, res) => {
  res.json({ message: 'Doctor routes - to be implemented' });
});

export default router; 