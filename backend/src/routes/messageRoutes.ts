import { Router } from 'express';

const router = Router();

// TODO: Implement message routes
router.get('/', (req, res) => {
  res.json({ message: 'Message routes - to be implemented' });
});

export default router; 