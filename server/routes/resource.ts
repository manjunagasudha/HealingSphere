import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/secure-resource', authenticateToken, (req, res) => {
  res.json({ message: 'You have access to this protected resource.' });
});

export default router;
