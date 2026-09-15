import { Router } from 'express';

const router = Router();

// GET /api/progress/overview - Dashboard stats overview
router.get('/overview', (req, res) => {
  res.json({
    xp: 2450,
    level: 4,
    streak: 12,
    longestStreak: 14,
    accuracy: 82,
    studyTimeMinutes: 340,
    quizzesCompleted: 18,
    topicsMastered: 8,
  });
});

// GET /api/progress/topics - Topic strengths and weak-topic alerts
router.get('/topics', (req, res) => {
  res.json({
    strongTopics: [
      { topic: 'Classical Mechanics', accuracy: 92 },
      { topic: 'Organic Reaction Mechanisms', accuracy: 84 },
      { topic: 'Operating Systems — Process Management', accuracy: 78 }
    ],
    weakTopics: [
      { topic: 'Thermodynamics & Heat Transfer', accuracy: 58 },
      { topic: 'Differential Equations', accuracy: 62 }
    ]
  });
});

// GET /api/progress/history - Attempt history
router.get('/history', (req, res) => {
  res.json({
    attempts: [
      { id: 'att-1', quizTitle: 'Newtonian Physics', score: 90, xpEarned: 150, completedAt: new Date().toISOString() },
      { id: 'att-2', quizTitle: 'OS Memory Management', score: 70, xpEarned: 90, completedAt: new Date().toISOString() }
    ]
  });
});

export default router;
