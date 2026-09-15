import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro';
  xp: number;
  level: string;
  streak: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'github') => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (_email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1200));
        set({
          user: {
            id: '1',
            name: 'Yashika Singh',
            email: _email,
            plan: 'pro',
            xp: 2450,
            level: 'Scholar',
            streak: 12,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      signup: async (name: string, email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({
          user: {
            id: '1',
            name,
            email,
            plan: 'free',
            xp: 0,
            level: 'Beginner',
            streak: 0,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      socialLogin: async (_provider: 'google' | 'github') => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({
          user: {
            id: '1',
            name: 'Yashika Singh',
            email: 'yashika@questify.com',
            plan: 'free',
            xp: 0,
            level: 'Beginner',
            streak: 0,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: 'questify-auth',
    }
  )
);
