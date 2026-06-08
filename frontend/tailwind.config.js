/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#f6f7f9',
          surface: '#ffffff',
          warm: '#eef4ff',
          subtle: '#f0f3f8',
        },
        fg: {
          DEFAULT: '#172033',
          base: '#3b4658',
          muted: '#6b7689',
          faint: '#8a95a6',
        },
        border: {
          DEFAULT: '#d8dee8',
          soft: '#edf1f6',
          strong: '#c2cbd8',
        },
        accent: {
          DEFAULT: '#2563eb',
          soft: '#2563eb14',
          hover: '#1d4ed8',
          ring: 'rgba(37, 99, 235, 0.22)',
          on: '#ffffff',
        },
        brand: {
          DEFAULT: '#9333ea',
          soft: '#9333ea14',
          light: '#a855f7',
          hover: '#7e22ce',
        },
        green: {
          DEFAULT: '#16a34a',
          bg: '#16a34a1a',
        },
        yellow: {
          DEFAULT: '#f59e0b',
          bg: '#f59e0b1a',
        },
        red: {
          DEFAULT: '#dc2626',
          bg: '#dc26261a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.22s cubic-bezier(0.2, 0, 0, 1)',
        'fade-in-up': 'fadeInUp 0.22s cubic-bezier(0.2, 0, 0, 1)',
        'scale-in': 'scaleIn 0.18s cubic-bezier(0.2, 0, 0, 1)',
        'enter': 'fadeInUp 0.22s cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(23, 32, 51, 0.06)',
        'md': '0 4px 12px rgba(23, 32, 51, 0.08)',
        'lg': '0 12px 40px rgba(23, 32, 51, 0.10)',
        'xl': '0 24px 60px rgba(23, 32, 51, 0.12)',
        'ring': '0 0 0 1px #d8dee8',
        'raised': '0 24px 72px rgba(23, 32, 51, 0.10)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '24px',
        pill: '9999px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
