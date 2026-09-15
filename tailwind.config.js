/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#05070f',
        surface: '#0d111d',
        surfaceHover: '#151b2e',
        primary: '#6366f1',
        primaryHover: '#4f46e5',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        
        // Custom UI components colors
        'bg-primary': '#05070f',
        'bg-secondary': '#0d111d',
        'bg-elevated': '#151b2e',
        'text-primary': '#ffffff',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        border: 'rgba(255, 255, 255, 0.08)',
        electric: '#4f46e5',
        'electric-light': '#818cf8',
        violet: '#8b5cf6',
        'violet-light': '#a78bfa',
        neon: '#10b981',
        'neon-light': '#34d399',
        gold: '#f59e0b',
        'gold-light': '#fbbf24',
        rose: '#f43f5e',
      },
    },
  },
  plugins: [],
}
