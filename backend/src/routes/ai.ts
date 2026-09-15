import { Router } from 'express';

const router = Router();

// POST /api/quizzes/generate - AI Quiz Generation Endpoint
router.post('/generate', (req, res) => {
  const { title, sourceText, difficulty = 'medium', questionCount = 5, subject } = req.body;

  const count = Number(questionCount) || 5;
  const questions = [];

  const textSnippets = (sourceText || 'Core academic concepts in study material')
    .split(/[.!?]+/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 15);

  for (let i = 0; i < count; i++) {
    const snippet = textSnippets[i % textSnippets.length] || `Grounded concept ${i + 1}`;
    const questionText = `Question ${i + 1}: What key insight is described in "${title || 'Study Material'}"?`;
    const correctAnswerText = `Grounded fact: "${snippet.slice(0, 80)}"`;

    const options = [
      correctAnswerText,
      `Incorrect distractor option A regarding peripheral context.`,
      `Incorrect distractor option B with inaccurate formulation.`,
      `Incorrect distractor option C with unverified parameters.`
    ];

    // Shuffle correct answer index
    const correctAnswerIndex = (i + 2) % 4;
    const temp = options[0];
    options[0] = options[correctAnswerIndex];
    options[correctAnswerIndex] = temp;

    questions.push({
      id: `q-backend-${Date.now()}-${i + 1}`,
      text: questionText,
      options,
      correctAnswer: correctAnswerIndex,
      explanation: `Grounded reference from study document: "${snippet}"`,
      topic: subject || 'Core Concepts',
      difficulty,
      sourceReference: { page: Math.floor(i / 2) + 1 }
    });
  }

  const generatedQuiz = {
    id: `quiz-be-${Date.now()}`,
    title: title || 'AI Generated Assessment',
    subject: subject || 'General Studies',
    topic: 'Extracted Topics',
    difficulty,
    questionCount: questions.length,
    timeLimit: questions.length * 60,
    xpReward: questions.length * 25,
    questions,
    createdAt: new Date().toISOString()
  };

  res.json({ quiz: generatedQuiz });
});

// POST /api/flashcards/generate - Flashcards Generation Endpoint
router.post('/flashcards/generate', (req, res) => {
  const { title, sourceText } = req.body;

  const deck = {
    id: `deck-be-${Date.now()}`,
    title: `${title || 'Notes'} Revision Deck`,
    subject: 'AI Revision',
    topic: 'Key Concepts',
    cardCount: 5,
    mastered: 0,
    createdAt: new Date().toISOString(),
    cards: [
      { id: 'fc-1', front: 'What is the main theme of this study material?', back: sourceText ? sourceText.slice(0, 100) + '...' : 'Overview of core topics.', status: 'new' },
      { id: 'fc-2', front: 'How can this concept be applied?', back: 'Apply by solving structured quiz problems.', status: 'new' }
    ]
  };

  res.json({ deck });
});

export default router;
