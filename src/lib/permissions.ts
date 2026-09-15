// ═══════════════════════════════════════════════════════
// QUESTIFY — Permissions & Subscription System
// Centralized feature gating for Free / Pro / Enterprise
// ═══════════════════════════════════════════════════════

import { useMemo, type ReactNode } from 'react';
import type { Plan, Feature, PlanLimit } from '@/types';

// ─── Plan → Features Mapping ──────────────────────────

export const PLAN_FEATURES: Record<Plan, Feature[]> = {
  free: [
    'flashcards',
    'leaderboard',
    'achievements',
  ],
  pro: [
    'flashcards',
    'leaderboard',
    'achievements',
    'ai_quiz_generation',
    'file_upload',
    'battle_mode',
    'advanced_analytics',
    'revision_scheduler',
    'export_results',
  ],
  enterprise: [
    'flashcards',
    'leaderboard',
    'achievements',
    'ai_quiz_generation',
    'file_upload',
    'battle_mode',
    'advanced_analytics',
    'revision_scheduler',
    'export_results',
    'custom_themes',
    'priority_support',
    'api_access',
  ],
};

// ─── Plan → Limits Mapping ────────────────────────────

export const PLAN_LIMITS: Record<Plan, Record<PlanLimit, number>> = {
  free: {
    uploadsPerMonth: 3,
    quizzesPerDay: 5,
    flashcardDecks: 3,
    questionsPerQuiz: 10,
    storageGB: 0.5,
    aiGenerations: 3,
  },
  pro: {
    uploadsPerMonth: 50,
    quizzesPerDay: 50,
    flashcardDecks: 50,
    questionsPerQuiz: 50,
    storageGB: 10,
    aiGenerations: 50,
  },
  enterprise: {
    uploadsPerMonth: -1, // unlimited
    quizzesPerDay: -1,
    flashcardDecks: -1,
    questionsPerQuiz: 100,
    storageGB: 100,
    aiGenerations: -1,
  },
};

// ─── Permission Check Functions ───────────────────────

/**
 * Check whether a plan has access to a specific feature.
 */
export function canAccess(plan: Plan, feature: Feature): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

/**
 * Get the numerical limit for a given plan and limit key.
 * Returns -1 for unlimited.
 */
export function getLimit(plan: Plan, limitKey: PlanLimit): number {
  return PLAN_LIMITS[plan][limitKey];
}

/**
 * Check if a limit value means "unlimited".
 */
export function isUnlimited(limitValue: number): boolean {
  return limitValue === -1;
}

/**
 * Get the minimum plan required for a feature.
 */
export function getRequiredPlan(feature: Feature): Plan {
  if (PLAN_FEATURES.free.includes(feature)) return 'free';
  if (PLAN_FEATURES.pro.includes(feature)) return 'pro';
  return 'enterprise';
}

/**
 * Get display name for a plan.
 */
export function getPlanDisplayName(plan: Plan): string {
  const names: Record<Plan, string> = {
    free: 'Free',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };
  return names[plan];
}

/**
 * Get display label for a limit.
 */
export function getLimitDisplayName(limitKey: PlanLimit): string {
  const names: Record<PlanLimit, string> = {
    uploadsPerMonth: 'Uploads per month',
    quizzesPerDay: 'Quizzes per day',
    flashcardDecks: 'Flashcard decks',
    questionsPerQuiz: 'Questions per quiz',
    storageGB: 'Storage',
  };
  return names[limitKey];
}

// ─── React Hook ───────────────────────────────────────

interface UsePermissionResult {
  allowed: boolean;
  currentPlan: Plan;
  requiredPlan: Plan;
}

/**
 * React hook to check if the current user can access a feature.
 * Uses the mock user's plan for now — will integrate with auth store later.
 *
 * @example
 * const { allowed, requiredPlan } = usePermission('battle_mode');
 * if (!allowed) showUpgradePrompt(requiredPlan);
 */
export function usePermission(feature: Feature): UsePermissionResult {
  // For the foundation layer, we hardcode the plan.
  // This will be replaced with Zustand store integration.
  const currentPlan: Plan = 'pro';

  return useMemo(
    () => ({
      allowed: canAccess(currentPlan, feature),
      currentPlan,
      requiredPlan: getRequiredPlan(feature),
    }),
    [currentPlan, feature]
  );
}

// ─── FeatureGate Component ────────────────────────────

interface FeatureGateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on the user's plan.
 *
 * @example
 * <FeatureGate feature="battle_mode" fallback={<UpgradeBanner />}>
 *   <BattleArena />
 * </FeatureGate>
 */
export function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps): ReactNode {
  const { allowed } = usePermission(feature);
  return allowed ? children : fallback;
}
