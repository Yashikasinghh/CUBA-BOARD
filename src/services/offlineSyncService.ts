// ═══════════════════════════════════════════════════════
// CUBA BOARD — Phase 16: Offline Sync & PWA Cache Engine
// Enables offline study, cached quizzes, and auto-sync when online
// ═══════════════════════════════════════════════════════

import { Quiz, QuizAttempt } from '@/types';

const OFFLINE_QUIZ_CACHE_KEY = 'cuba_board_offline_quizzes';
const OFFLINE_ATTEMPTS_QUEUE_KEY = 'cuba_board_pending_attempts';

/**
 * Caches quizzes for offline access in browser LocalStorage / IndexedDB
 */
export function cacheQuizOffline(quiz: Quiz): void {
  try {
    const existing = getOfflineCachedQuizzes();
    const filtered = existing.filter((q) => q.id !== quiz.id);
    filtered.unshift(quiz);
    localStorage.setItem(OFFLINE_QUIZ_CACHE_KEY, JSON.stringify(filtered.slice(0, 20)));
  } catch (err) {
    console.warn('Failed to cache quiz offline:', err);
  }
}

/**
 * Retrieves offline cached quizzes
 */
export function getOfflineCachedQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUIZ_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Queues quiz attempt for auto-sync when network connection is restored
 */
export function queueOfflineAttempt(attempt: QuizAttempt): void {
  try {
    const raw = localStorage.getItem(OFFLINE_ATTEMPTS_QUEUE_KEY);
    const queue: QuizAttempt[] = raw ? JSON.parse(raw) : [];
    queue.push(attempt);
    localStorage.setItem(OFFLINE_ATTEMPTS_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn('Failed to queue offline attempt:', err);
  }
}

/**
 * Synchronizes pending offline attempts with backend server when network is online
 */
export async function syncPendingAttempts(): Promise<number> {
  try {
    const raw = localStorage.getItem(OFFLINE_ATTEMPTS_QUEUE_KEY);
    const queue: QuizAttempt[] = raw ? JSON.parse(raw) : [];

    if (queue.length === 0) return 0;

    let syncedCount = 0;
    for (const attempt of queue) {
      try {
        const response = await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attempt),
        });
        if (response.ok) {
          syncedCount++;
        }
      } catch (err) {
        // Network offline, keep in queue
      }
    }

    if (syncedCount > 0) {
      const remaining = queue.slice(syncedCount);
      localStorage.setItem(OFFLINE_ATTEMPTS_QUEUE_KEY, JSON.stringify(remaining));
    }

    return syncedCount;
  } catch (err) {
    return 0;
  }
}

/**
 * Checks if browser network is online
 */
export function isNetworkOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
