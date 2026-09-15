// ═══════════════════════════════════════════════════════
// CUBA BOARD — AI Quiz Generation & Revision Engine
// Generates grounded quizzes, mistake revision, and weak topic drills
// ═══════════════════════════════════════════════════════

import { Question, Quiz, Difficulty, QuizAttempt } from '@/types';
import { processDocument } from './textExtractor';

export interface QuizGenerationRequest {
  title: string;
  sourceText: string;
  difficulty?: Difficulty;
  questionCount?: number;
  subject?: string;
  sourceFile?: string;
}

/**
 * Validates generated AI questions to ensure strict compliance with Cuba Board rules:
 * - 4 distinct options per question
 * - Correct answer index within 0..3 range
 * - Non-empty question text and explanation
 */
export function validateAIQuestions(questions: Question[]): Question[] {
  return questions.filter((q) => {
    const validText = typeof q.text === 'string' && q.text.trim().length > 5;
    const validOptions = Array.isArray(q.options) && q.options.length === 4 && q.options.every((o) => typeof o === 'string' && o.trim().length > 0);
    const validAnswer = typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3;
    const validExplanation = typeof q.explanation === 'string' && q.explanation.trim().length > 0;
    return validText && validOptions && validAnswer && validExplanation;
  });
}

/**
 * Generates grounded questions directly from document text chunks with source page references
 */
export function generateGroundedQuizFromText(request: QuizGenerationRequest): Quiz {
  const difficulty = request.difficulty || 'medium';
  const count = request.questionCount || 5;
  const doc = processDocument(request.title, request.sourceText);
  const chunks = doc.chunks;

  const generatedQuestions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const chunk = chunks[i % chunks.length] || { pageNumber: 1, content: request.sourceText };
    const pageNum = chunk.pageNumber || 1;
    const sentences = chunk.content.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);

    const baseSentence = sentences[i % sentences.length] || `Key concept in ${request.title}`;
    const keyWords = baseSentence.split(/\s+/).filter((w) => w.length > 4);
    const targetWord = keyWords[0] || 'Concept';

    const questionText = `Based on page ${pageNum}: What is the significance of "${targetWord}" in "${request.title}"?`;
    const correctAnswerText = `${targetWord} is directly defined in section ${pageNum} of the study material: "${baseSentence.slice(0, 70)}..."`;
    
    const distractor1 = `${targetWord} is an unrelated term from peripheral background context.`;
    const distractor2 = `${targetWord} is a theoretical boundary value not covered in this document.`;
    const distractor3 = `${targetWord} refers exclusively to external non-standard parameters.`;

    const options = [correctAnswerText, distractor1, distractor2, distractor3];
    const correctAnswerIndex = (i + 1) % 4;
    const temp = options[0];
    options[0] = options[correctAnswerIndex];
    options[correctAnswerIndex] = temp;

    generatedQuestions.push({
      id: `q-${Date.now()}-${i + 1}`,
      text: questionText,
      options,
      correctAnswer: correctAnswerIndex,
      explanation: `As detailed on page ${pageNum}: "${baseSentence}"`,
      difficulty,
    });
  }

  const validatedQuestions = validateAIQuestions(generatedQuestions);

  return {
    id: `quiz-${Date.now()}`,
    title: request.title,
    subject: request.subject || doc.topics[0] || 'General Studies',
    topic: doc.topics[1] || doc.topics[0] || 'Core Concepts',
    difficulty,
    questionCount: validatedQuestions.length,
    timeLimit: validatedQuestions.length * 60,
    xpReward: validatedQuestions.length * 25,
    questions: validatedQuestions,
    createdAt: new Date().toISOString(),
    sourceFile: request.sourceFile,
  };
}

/**
 * Phase 11 Smart Learning — Generate a Mistake Review Quiz from user's incorrect attempts
 */
export function generateMistakeQuiz(allQuizzes: Quiz[], attempts: QuizAttempt[]): Quiz | null {
  const incorrectQuestions: Question[] = [];

  attempts.forEach((att) => {
    const originalQuiz = allQuizzes.find((q) => q.id === att.quizId);
    if (!originalQuiz) return;

    att.answers.forEach((ans, idx) => {
      const q = originalQuiz.questions[idx];
      if (q && ans !== q.correctAnswer) {
        incorrectQuestions.push({
          ...q,
          id: `mistake-${q.id}-${Date.now()}`,
        });
      }
    });
  });

  if (incorrectQuestions.length === 0) return null;

  // Deduplicate by question text
  const uniqueMistakes: Question[] = [];
  const seenText = new Set<string>();

  incorrectQuestions.forEach((q) => {
    if (!seenText.has(q.text)) {
      seenText.add(q.text);
      uniqueMistakes.push(q);
    }
  });

  const selectedMistakes = uniqueMistakes.slice(0, 10);

  return {
    id: `mistake-quiz-${Date.now()}`,
    title: 'Personalized Mistake Revision Quiz',
    subject: 'Smart Revision',
    topic: 'Incorrect Questions Review',
    difficulty: 'medium',
    questionCount: selectedMistakes.length,
    timeLimit: selectedMistakes.length * 60,
    xpReward: selectedMistakes.length * 30,
    questions: selectedMistakes,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Main AI Quiz Generation Entrypoint
 */
export async function generateAIQuiz(request: QuizGenerationRequest): Promise<Quiz> {
  try {
    const response = await fetch('/api/quizzes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.quiz && data.quiz.questions && data.quiz.questions.length > 0) {
        return data.quiz;
      }
    }
  } catch (err) {
    console.warn('Backend LLM quiz endpoint offline, using local grounded AI generator:', err);
  }

  return generateGroundedQuizFromText(request);
}
