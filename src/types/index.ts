// ═══════════════════════════════════════════════════════
// QUESTIFY — Type Definitions
// Comprehensive types for the entire learning platform
// ═══════════════════════════════════════════════════════

// ─── Subscription Plans ───────────────────────────────

export type Plan = 'free' | 'pro' | 'enterprise';

// ─── User Types ───────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'teacher' | 'aspirant';
  plan: Plan;
  xp: number;
  xpToNextLevel: number;
  level: number;
  streak: number;
  longestStreak: number;
  quizzesCompleted: number;
  accuracy: number;
  studyTimeMinutes: number;
  topicsMastered: number;
  joinedAt: string;
  preferences: UserPreferences;
  stats: {
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export interface UserPreferences {
  dailyGoalMinutes: number;
  examType: string;
  subjects: string[];
  notifications: boolean;
  darkMode: boolean;
}

// ─── Quiz Types ───────────────────────────────────────

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  timeLimit: number; // seconds
  xpReward: number;
  questions: Question[];
  createdAt: string;
  sourceFile?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index into options[]
  explanation: string;
  difficulty: Difficulty;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle?: string;
  answers: (number | null)[];
  score: number; // percentage 0-100
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // seconds
  timeSpent?: number;
  xpEarned: number;
  completedAt: string;
  isPassed?: boolean;
}

// ─── Flashcard Types ──────────────────────────────────

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  topic: string;
  cardCount: number;
  mastered: number;
  cards: Flashcard[];
  lastReviewed?: string;
  createdAt: string;
}

export type FlashcardStatus = 'new' | 'learning' | 'mastered';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: FlashcardStatus;
  bookmarked: boolean;
  nextReview?: string;
}

// ─── Upload Types ─────────────────────────────────────

export type FileType = 'pdf' | 'ppt' | 'txt' | 'md' | 'image';
export type UploadStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number; // bytes
  status: UploadStatus;
  uploadedAt: string;
  quizzesGenerated: number;
  flashcardsGenerated: number;
}

export type Upload = UploadedFile;

// ─── Achievement Types ────────────────────────────────

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'quiz' | 'streak' | 'revision' | 'battle' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  rarity: AchievementRarity;
  category: AchievementCategory;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

// ─── Leaderboard Types ────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  quizzesCompleted: number;
  accuracy: number;
}

// ─── Battle Types ─────────────────────────────────────

export type BattleStatus = 'waiting' | 'in_progress' | 'completed';

export interface BattleOpponent {
  name: string;
  avatar: string;
  level: number;
}

export interface Battle {
  id: string;
  opponent: BattleOpponent;
  subject: string;
  status: BattleStatus;
  playerScore: number;
  opponentScore: number;
  xpReward: number;
  startedAt: string;
}

// ─── Revision Types ───────────────────────────────────

export interface RevisionTopic {
  id: string;
  name: string;
  subject: string;
  strength: number; // 0-100
  lastRevised?: string;
  nextRevision?: string;
  questionsAttempted: number;
  accuracy: number;
}

// ─── Activity Types ───────────────────────────────────

export type ActivityType =
  | 'quiz_completed'
  | 'flashcard_reviewed'
  | 'achievement_unlocked'
  | 'level_up'
  | 'streak'
  | 'battle_won'
  | 'upload';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xp?: number;
  timestamp: string;
}

// ─── Notification Types ───────────────────────────────

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, defaults to 5000
  timestamp: number;
}

// ─── Level System ─────────────────────────────────────

export interface LevelDefinition {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  icon: string; // emoji
}

// ─── Chart Data ───────────────────────────────────────

export interface StudyDataPoint {
  day: string;
  studyMinutes: number;
  quizzes: number;
}

export interface AccuracyDataPoint {
  date: string;
  accuracy: number;
}

// ─── Feature / Permission Types ───────────────────────

export type Feature =
  | 'ai_quiz_generation'
  | 'file_upload'
  | 'flashcards'
  | 'battle_mode'
  | 'advanced_analytics'
  | 'revision_scheduler'
  | 'leaderboard'
  | 'achievements'
  | 'export_results'
  | 'custom_themes'
  | 'priority_support'
  | 'api_access';

export type PlanLimit =
  | 'uploadsPerMonth'
  | 'quizzesPerDay'
  | 'flashcardDecks'
  | 'questionsPerQuiz'
  | 'storageGB'
  | 'aiGenerations';

// ─── Navigation ───────────────────────────────────────

export interface NavItem {
  label: string;
  path: string;
  icon: string; // Lucide icon name
  badge?: number;
  isPro?: boolean;
}

// ─── Component Props Helpers ──────────────────────────

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithChildrenAndClassName extends WithChildren, WithClassName {}
