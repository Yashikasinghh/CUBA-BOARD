import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Plan } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { PLAN_LIMITS } from '@/lib/permissions';

type LimitKey = 'uploadsPerMonth' | 'quizzesPerDay' | 'aiGenerations';

interface SubscriptionState {
  plan: Plan;
  uploadsUsed: number;
  quizzesToday: number;
  aiGenerationsUsed: number;
  upgradeToPro: () => void;
  checkLimit: (limitKey: LimitKey) => boolean;
  incrementUsage: (key: 'uploads' | 'quizzes' | 'aiGenerations') => void;
  resetDailyLimits: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: 'free',
      uploadsUsed: 2,
      quizzesToday: 1,
      aiGenerationsUsed: 3,

      upgradeToPro: () => {
        set({ plan: 'pro' });
      },

      checkLimit: (limitKey: LimitKey): boolean => {
        const state = get();
        const limits = PLAN_LIMITS[state.plan];

        switch (limitKey) {
          case 'uploadsPerMonth':
            return state.uploadsUsed >= limits.uploadsPerMonth;
          case 'quizzesPerDay':
            return state.quizzesToday >= limits.quizzesPerDay;
          case 'aiGenerations':
            return state.aiGenerationsUsed >= limits.aiGenerations;
          default:
            return false;
        }
      },

      incrementUsage: (key: 'uploads' | 'quizzes' | 'aiGenerations') => {
        set((state) => {
          switch (key) {
            case 'uploads':
              return { uploadsUsed: state.uploadsUsed + 1 };
            case 'quizzes':
              return { quizzesToday: state.quizzesToday + 1 };
            case 'aiGenerations':
              return { aiGenerationsUsed: state.aiGenerationsUsed + 1 };
            default:
              return state;
          }
        });
      },

      resetDailyLimits: () => {
        set({ quizzesToday: 0 });
      },
    }),
    {
      name: STORAGE_KEYS.SUBSCRIPTION,
    }
  )
);
