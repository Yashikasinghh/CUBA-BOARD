import type { Quiz, QuizAttempt, QuizConfig } from '@/types';
import { mockQuizzes } from '@/lib/mockData';
import { generateId, delay, shuffle } from '@/lib/utils';
import { XP_PER_CORRECT_ANSWER, XP_PER_PERFECT_SCORE } from '@/lib/constants';

/**
 * Returns all available quizzes.
 */
export async function getQuizzes(): Promise<Quiz[]> {
  await delay(400);
  return mockQuizzes;
}

/**
 * Finds a quiz by its ID.
 */
export async function getQuizById(id: string): Promise<Quiz | undefined> {
  await delay(300);
  return mockQuizzes.find((q) => q.id === id);
}

/**
 * Simulates AI-powered quiz generation from an uploaded file.
 * Returns a new quiz with shuffled questions based on the provided config.
 */
export async function generateQuiz(
  fileId: string,
  config: Partial<QuizConfig> = {}
): Promise<Quiz> {
  // Simulate AI processing time
  await delay(2000 + Math.random() * 1500);

  const {
    questionCount = 5,
    difficulty = 'medium',
    timeLimit = 600,
  } = config;

  // For demo: create a quiz from shuffled questions across all mock quizzes
  const allQuestions = mockQuizzes.flatMap((q) => q.questions);
  const shuffled = shuffle(allQuestions);
  const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  const quiz: Quiz = {
    id: generateId(),
    title: `Generated Quiz — ${new Date().toLocaleDateString()}`,
    description: `AI-generated quiz from uploaded file with ${selectedQuestions.length} questions.`,
    subject: 'Mixed',
    topic: 'AI Generated',
    difficulty,
    questions: selectedQuestions.map((q, i) => ({
      ...q,
      id: `gen-q-${i}`,
    })),
    timeLimit,
    passingScore: 70,
    createdAt: new Date().toISOString(),
    sourceFileId: fileId,
    tags: ['ai-generated'],
    attempts: 0,
    averageScore: 0,
  };

  return quiz;
}

/**
 * Calculates a quiz submission and returns the attempt result.
 */
export async function submitQuiz(
  quizId: string,
  answers: (number | null)[]
): Promise<QuizAttempt> {
  await delay(500);

  const quiz = mockQuizzes.find((q) => q.id === quizId);
  if (!quiz) {
    throw new Error(`Quiz not found: ${quizId}`);
  }

  let correctAnswers = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const totalQuestions = quiz.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassed = score >= quiz.passingScore;

  let xpEarned = correctAnswers * XP_PER_CORRECT_ANSWER;
  if (score === 100) {
    xpEarned += XP_PER_PERFECT_SCORE;
  }

  return {
    id: generateId(),
    quizId: quiz.id,
    quizTitle: quiz.title,
    answers: [...answers],
    score,
    totalQuestions,
    correctAnswers,
    timeSpent: Math.floor(Math.random() * 300) + 120, // simulated
    completedAt: new Date().toISOString(),
    xpEarned,
    isPassed,
  };
}
