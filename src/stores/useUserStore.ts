import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPreferences, QuizAttempt } from '@/types';
import { currentUser } from '@/lib/mockData';
import { STORAGE_KEYS, xpForLevel } from '@/lib/constants';

interface UserState {
  user: User;
  attempts: QuizAttempt[];
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => void;
  addAttempt: (attempt: QuizAttempt) => void;
}

const initialAttempts: QuizAttempt[] = [
  {
    id: 'attempt_001',
    quizId: 'quiz_001',
    quizTitle: "Newton's Laws of Motion",
    answers: [1, 1, 1, 0, 3, 1, 2, 2],
    score: 100,
    totalQuestions: 8,
    correctAnswers: 8,
    timeTaken: 240,
    xpEarned: 130,
    completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    isPassed: true,
  },
  {
    id: 'attempt_002',
    quizId: 'quiz_002',
    quizTitle: 'Periodic Table & Elements',
    answers: [1, 2, 1, 3, 0, 1, 0],
    score: 71,
    totalQuestions: 7,
    correctAnswers: 5,
    timeTaken: 180,
    xpEarned: 50,
    completedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
    isPassed: true,
  },
  {
    id: 'attempt_003',
    quizId: 'quiz_003',
    quizTitle: 'Differential Calculus',
    answers: [0, 2, 0, 1, 0, 0],
    score: 50,
    totalQuestions: 6,
    correctAnswers: 3,
    timeTaken: 400,
    xpEarned: 30,
    completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // Yesterday
    isPassed: false,
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: currentUser,
      attempts: initialAttempts,

      addXP: (amount: number) =>
        set((state) => {
          let { xp, xpToNextLevel, level } = state.user;
          xp += amount;

          // Check for level ups
          while (xp >= xpToNextLevel) {
            xp -= xpToNextLevel;
            level += 1;
            xpToNextLevel = xpForLevel(level + 1);
          }

          return {
            user: {
              ...state.user,
              xp,
              xpToNextLevel,
              level,
              stats: {
                ...state.user.stats,
                totalXP: state.user.stats.totalXP + amount,
              },
            },
          };
        }),

      incrementStreak: () =>
        set((state) => {
          const newStreak = state.user.streak + 1;
          return {
            user: {
              ...state.user,
              streak: newStreak,
              stats: {
                ...state.user.stats,
                currentStreak: newStreak,
                longestStreak: Math.max(state.user.stats.longestStreak, newStreak),
              },
            },
          };
        }),

      updatePreferences: (prefs: Partial<UserPreferences>) =>
        set((state) => ({
          user: {
            ...state.user,
            preferences: { ...state.user.preferences, ...prefs },
          },
        })),

      updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),

      addAttempt: (attempt: QuizAttempt) =>
        set((state) => {
          const newAttempts = [attempt, ...state.attempts];
          const quizzesCompleted = state.user.quizzesCompleted + 1;
          const totalScores = newAttempts.reduce((acc, curr) => acc + curr.score, 0);
          const accuracy = Math.round(totalScores / newAttempts.length);
          
          return {
            attempts: newAttempts,
            user: {
              ...state.user,
              quizzesCompleted,
              accuracy,
            }
          };
        }),
    }),
    {
      name: STORAGE_KEYS.USER,
    }
  )
);
