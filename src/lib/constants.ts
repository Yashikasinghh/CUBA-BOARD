// ═══════════════════════════════════════════════════════
// QUESTIFY — Constants
// Level definitions, XP rewards, subject colors
// ═══════════════════════════════════════════════════════

import type { LevelDefinition } from '@/types';

// ─── Level Definitions ────────────────────────────────

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { level: 1, name: 'Beginner',  minXP: 0,    maxXP: 500,   icon: '🌱' },
  { level: 2, name: 'Explorer',  minXP: 500,  maxXP: 1500,  icon: '🧭' },
  { level: 3, name: 'Scholar',   minXP: 1500, maxXP: 3500,  icon: '📚' },
  { level: 4, name: 'Master',    minXP: 3500, maxXP: 7000,  icon: '🎓' },
  { level: 5, name: 'Legend',    minXP: 7000, maxXP: 15000, icon: '👑' },
];

// ─── XP Rewards ───────────────────────────────────────

export const XP_REWARDS = {
  quizComplete: 50,
  quizPerfectScore: 100,
  quizFirstAttempt: 25,
  streakDay: 15,
  streakWeek: 100,
  streakMonth: 500,
  flashcardReview: 10,
  flashcardDeckComplete: 40,
  flashcardMaster: 20,
  battleWin: 75,
  battleDraw: 25,
  uploadFile: 20,
  achievementUnlock: 50,
  dailyGoalMet: 30,
  levelUp: 0, // level up is a reward itself
  firstQuiz: 50,
  tenthQuiz: 100,
  hundredthQuiz: 250,
} as const;

// ─── Subject Colors ───────────────────────────────────
// Each subject gets a consistent color pair (base, light)

export const SUBJECT_COLORS: Record<string, { base: string; light: string; bg: string }> = {
  Physics: {
    base: '#3b82f6',
    light: '#60a5fa',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  Chemistry: {
    base: '#22c55e',
    light: '#4ade80',
    bg: 'rgba(34, 197, 94, 0.12)',
  },
  Mathematics: {
    base: '#8b5cf6',
    light: '#a78bfa',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
  Biology: {
    base: '#f59e0b',
    light: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  History: {
    base: '#f43f5e',
    light: '#fb7185',
    bg: 'rgba(244, 63, 94, 0.12)',
  },
  'Computer Science': {
    base: '#06b6d4',
    light: '#22d3ee',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  English: {
    base: '#ec4899',
    light: '#f472b6',
    bg: 'rgba(236, 72, 153, 0.12)',
  },
  Geography: {
    base: '#14b8a6',
    light: '#2dd4bf',
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  Economics: {
    base: '#eab308',
    light: '#facc15',
    bg: 'rgba(234, 179, 8, 0.12)',
  },
  'Political Science': {
    base: '#6366f1',
    light: '#818cf8',
    bg: 'rgba(99, 102, 241, 0.12)',
  },
};

// ─── Default Subject Color (fallback) ─────────────────

export const DEFAULT_SUBJECT_COLOR = {
  base: '#94a3b8',
  light: '#cbd5e1',
  bg: 'rgba(148, 163, 184, 0.12)',
};

// ─── Difficulty Config ────────────────────────────────

export const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    xpMultiplier: 1,
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    xpMultiplier: 1.5,
  },
  hard: {
    label: 'Hard',
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.12)',
    xpMultiplier: 2,
  },
} as const;

// ─── Rarity Config ────────────────────────────────────

export const RARITY_CONFIG = {
  common: {
    label: 'Common',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    borderColor: '#475569',
  },
  rare: {
    label: 'Rare',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    borderColor: '#2563eb',
  },
  epic: {
    label: 'Epic',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    borderColor: '#7c3aed',
  },
  legendary: {
    label: 'Legendary',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#d97706',
  },
} as const;

// ─── Time Constants ───────────────────────────────────

export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

// ─── App Metadata ─────────────────────────────────────

export const APP_NAME = 'Questify';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered Learning Platform';

// ─── Storage Keys ─────────────────────────────────────

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'questify_auth_token',
  USER: 'questify_user',
  THEME: 'questify_theme',
  SUBSCRIPTION: 'questify_subscription',
  FLASHCARDS: 'questify_flashcards',
} as const;

// ─── Additional Rewards ───────────────────────────────

export const XP_PER_CORRECT_ANSWER = 10;
export const XP_PER_PERFECT_SCORE = 50;

// ─── Notifications Config ─────────────────────────────

export const NOTIFICATION_DURATION = 4000;
export const MAX_NOTIFICATIONS = 5;

// ─── XP Level progression logic ────────────────────────

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const current = LEVEL_DEFINITIONS.find((l) => l.level === level);
  const prev = LEVEL_DEFINITIONS.find((l) => l.level === level - 1);
  if (current && prev) {
    return current.minXP - prev.minXP;
  }
  const maxDefined = LEVEL_DEFINITIONS[LEVEL_DEFINITIONS.length - 1];
  return maxDefined ? maxDefined.maxXP - maxDefined.minXP : 10000;
}
