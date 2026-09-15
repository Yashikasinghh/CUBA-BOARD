import { Router } from 'express';

const router = Router();

// Mock endpoints for MVP
router.post('/login', (req, res) => {
  res.json({ token: 'mock-jwt-token', user: { id: 1, name: 'Student' } });
});

router.post('/register', (req, res) => {
  res.json({ message: 'User created successfully' });
});

export default router;
