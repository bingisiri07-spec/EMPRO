/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#080D1B',
          surface: '#10182A',
          elevated: '#151F35',
          card: '#111B2F',
          border: '#1E293B',
          'border-subtle': '#152238',
          hover: '#19253F',
        },
        accent: {
          blue: '#3B82F6',
          'blue-hover': '#2563EB',
          'blue-dark': '#1D4ED8',
          cyan: '#06B6D4',
          'cyan-hover': '#0891B2',
          glow: 'rgba(59, 130, 246, 0.15)',
        },
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
          subtle: '#475569',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'dark-md': '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'blue-glow': '0 0 20px -3px rgba(59, 130, 246, 0.25)',
        'cyan-glow': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [],
};
