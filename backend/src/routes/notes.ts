import { Router } from 'express';

const router = Router();

// Mock endpoints for MVP
router.post('/upload', (req, res) => {
  // Simulate AI processing of notes
  setTimeout(() => {
    res.json({ 
      message: 'Notes uploaded and processed',
      noteId: 'mock-uuid-123',
      quizGenerated: true,
      flashcardsGenerated: 15
    });
  }, 2000);
});

router.get('/', (req, res) => {
  res.json([{ id: 1, title: 'Cellular Biology' }]);
});

export default router;
