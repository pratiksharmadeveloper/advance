import { Router } from 'express';

const router = Router();

// TODO: Implement news routes
router.get('/', (req, res) => {
  res.json({ message: 'News routes - to be implemented' });
});

export default router; 