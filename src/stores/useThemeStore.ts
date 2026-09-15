import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccentColor } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface ThemeState {
  isDarkMode: boolean;
  accentColor: AccentColor;
  toggleDarkMode: () => void;
  setAccentColor: (color: AccentColor) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: true,
      accentColor: 'blue',

      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          // Update document class for global dark mode
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newMode };
        });
      },

      setAccentColor: (color: AccentColor) => {
        set({ accentColor: color });
        // Update CSS custom property for accent color
        const accentMap: Record<AccentColor, string> = {
          blue: '#3b82f6',
          violet: '#8b5cf6',
          green: '#22c55e',
        };
        document.documentElement.style.setProperty('--color-accent', accentMap[color]);
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.isDarkMode) {
            document.documentElement.classList.add('dark');
          }
        };
      },
    }
  )
);
