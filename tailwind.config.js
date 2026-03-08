/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc0c0',
          300: '#ff9090',
          400: '#ff5050',
          500: '#ff2020',
          600: '#e60000',
          700: '#c00000',
          800: '#900000',
          900: '#700000',
        },
        dark: {
          100: '#1e1e2e',
          200: '#181825',
          300: '#11111b',
          400: '#0d0d17',
        },
        surface: {
          100: '#2a2a3e',
          200: '#232334',
          300: '#1c1c2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px #ff2020, 0 0 20px #ff2020' },
          to: {
            boxShadow: '0 0 20px #ff2020, 0 0 40px #ff2020, 0 0 60px #ff2020',
          },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'linear-gradient(135deg, #11111b 0%, #1e1e2e 50%, #2a1a1a 100%)',
      },
    },
  },
  plugins: [],
};