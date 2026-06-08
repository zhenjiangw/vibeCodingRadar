/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        surface: {
          deep:    '#0c0a1d',
          canvas:  '#110f28',
          card:    '#181633',
          elevated:'#201e3d',
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out',
        'fade-in-up':    'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-scale': 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right':'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-up':   'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':       'shimmer 2.5s infinite',
        'pulse-glow':    'pulse-glow 2.5s ease-in-out infinite',
        'float':         'float 3.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 8px rgba(99, 102, 241, 0.2)' },
          '50%':      { 'box-shadow': '0 0 20px rgba(99, 102, 241, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'card':      '0 2px 8px rgba(0, 0, 0, 0.25)',
        'elevated':  '0 8px 32px rgba(0, 0, 0, 0.35)',
        'glow':      '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-warm': '0 0 20px rgba(245, 158, 11, 0.2)',
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '14px',
        xl:  '20px',
      },
    },
  },
  plugins: [],
}
