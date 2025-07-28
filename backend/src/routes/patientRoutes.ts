import { Router } from 'express';

const router = Router();

// TODO: Implement patient routes
router.get('/', (req, res) => {
  res.json({ message: 'Patient routes - to be implemented' });
});

export default router; 