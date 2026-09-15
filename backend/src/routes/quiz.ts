import { Router } from 'express';

const router = Router();

// Mock endpoints for MVP
router.get('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Cellular Biology Quiz',
    questions: [
      {
        id: 1,
        text: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
      }
    ]
  });
});

router.post('/:id/attempt', (req, res) => {
  res.json({ 
    message: 'Quiz submitted',
    score: 100,
    xpEarned: 145
  });
});

export default router;
