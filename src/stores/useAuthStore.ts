import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/constants';
import { delay } from '@/lib/utils';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        await delay(800);

        // Simulate validation
        if (!email.includes('@')) {
          set({ isLoading: false });
          throw new Error('Invalid email address');
        }

        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-${Date.now()}`);
        set({ isAuthenticated: true, isLoading: false });
      },

      signup: async (_name: string, email: string, _password: string) => {
        set({ isLoading: true });
        await delay(800);

        if (!email.includes('@')) {
          set({ isLoading: false });
          throw new Error('Invalid email address');
        }

        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-${Date.now()}`);
        set({ isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        set({ isAuthenticated: false, isLoading: false });
      },

      checkAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        set({ isAuthenticated: !!token });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
