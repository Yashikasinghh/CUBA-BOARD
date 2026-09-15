// ═══════════════════════════════════════════════════════
// CUBA BOARD — Phase 17: Achievement & Badge Engine
// Evaluates user progress, unlocks trophies, & triggers audio rewards
// ═══════════════════════════════════════════════════════

import { Achievement } from '@/types';
import { soundEffects } from './soundEffectsService';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Step',
    description: 'Complete your first AI-generated quiz assessment.',
    icon: 'Brain',
    rarity: 'common',
    category: 'quiz',
    requirement: 1,
    progress: 1,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'ach-2',
    title: 'Streak Flame',
    description: 'Maintain an active daily study streak of 7+ days.',
    icon: 'Flame',
    rarity: 'rare',
    category: 'streak',
    requirement: 7,
    progress: 7,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'ach-3',
    title: 'Battle Champion',
    description: 'Win a 1v1 battle match in the Arena.',
    icon: 'Swords',
    rarity: 'epic',
    category: 'battle',
    requirement: 1,
    progress: 1,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'ach-4',
    title: 'Master Scholar',
    description: 'Achieve a 100% perfect score on any quiz.',
    icon: 'Trophy',
    rarity: 'legendary',
    category: 'quiz',
    requirement: 100,
    progress: 85,
    unlocked: false,
  },
  {
    id: 'ach-5',
    title: 'Flashcard Genius',
    description: 'Master 20+ flashcards across your decks.',
    icon: 'Layers',
    rarity: 'rare',
    category: 'revision',
    requirement: 20,
    progress: 12,
    unlocked: false,
  }
];

/**
 * Checks and unlocks pending achievements based on updated user metrics
 */
export function checkAchievements(
  quizzesCompleted: number,
  streak: number,
  lastScore: number,
  masteredCards: number,
  achievements: Achievement[]
): { updated: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];

  const updated = achievements.map((ach) => {
    if (ach.unlocked) return ach;

    let shouldUnlock = false;
    let newProgress = ach.progress;

    if (ach.id === 'ach-1' && quizzesCompleted >= 1) {
      shouldUnlock = true;
      newProgress = 1;
    } else if (ach.id === 'ach-2' && streak >= 7) {
      shouldUnlock = true;
      newProgress = streak;
    } else if (ach.id === 'ach-4' && lastScore === 100) {
      shouldUnlock = true;
      newProgress = 100;
    } else if (ach.id === 'ach-5') {
      newProgress = masteredCards;
      if (masteredCards >= 20) shouldUnlock = true;
    }

    if (shouldUnlock) {
      const unlockedAch = {
        ...ach,
        progress: ach.requirement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedAch);
      soundEffects.playVictory();
      return unlockedAch;
    }

    return { ...ach, progress: newProgress };
  });

  return { updated, newlyUnlocked };
}
