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
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Violet 500
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#10B981', // Emerald 500
          foreground: '#FFFFFF',
        },
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
        muted: '#94A3B8', // Slate 400
        // New vibrant palette
        violet: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        fuchsia: {
          500: '#D946EF',
          600: '#C026D3',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        rose: {
          500: '#F43F5E',
        },
        cyan: {
          500: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 20px rgba(79, 70, 229, 0.35)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 0 0 1px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}
