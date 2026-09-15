import { create } from 'zustand';
import type { Quiz, QuizAttempt } from '@/types';
import { generateId } from '@/lib/utils';
import { XP_PER_CORRECT_ANSWER, XP_PER_PERFECT_SCORE } from '@/lib/constants';

interface QuizState {
  activeQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: (number | null)[];
  timeRemaining: number;
  isComplete: boolean;
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => QuizAttempt;
  resetQuiz: () => void;
}

const initialState = {
  activeQuiz: null,
  currentQuestionIndex: 0,
  answers: [] as (number | null)[],
  timeRemaining: 0,
  isComplete: false,
};

export const useQuizStore = create<QuizState>()((set, get) => ({
  ...initialState,

  startQuiz: (quiz: Quiz) => {
    set({
      activeQuiz: quiz,
      currentQuestionIndex: 0,
      answers: new Array(quiz.questions.length).fill(null),
      timeRemaining: quiz.timeLimit,
      isComplete: false,
    });
  },

  answerQuestion: (questionIndex: number, answerIndex: number) => {
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[questionIndex] = answerIndex;
      return { answers: newAnswers };
    });
  },

  nextQuestion: () => {
    set((state) => {
      const quiz = state.activeQuiz;
      if (!quiz) return state;
      const nextIndex = Math.min(state.currentQuestionIndex + 1, quiz.questions.length - 1);
      return { currentQuestionIndex: nextIndex };
    });
  },

  previousQuestion: () => {
    set((state) => {
      const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
      return { currentQuestionIndex: prevIndex };
    });
  },

  completeQuiz: (): QuizAttempt => {
    const state = get();
    const quiz = state.activeQuiz;

    if (!quiz) {
      throw new Error('No active quiz to complete');
    }

    // Calculate results
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (state.answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= quiz.passingScore;
    const timeSpent = quiz.timeLimit - state.timeRemaining;

    // Calculate XP
    let xpEarned = correctAnswers * XP_PER_CORRECT_ANSWER;
    if (score === 100) {
      xpEarned += XP_PER_PERFECT_SCORE;
    }

    const attempt: QuizAttempt = {
      id: generateId(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      answers: [...state.answers],
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      completedAt: new Date().toISOString(),
      xpEarned,
      isPassed,
    };

    set({ isComplete: true });

    return attempt;
  },

  resetQuiz: () => {
    set(initialState);
  },
}));
