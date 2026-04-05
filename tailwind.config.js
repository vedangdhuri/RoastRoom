/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Electric Coliseum" Design System from Stitch
        brand: {
          50: '#f3eeff',
          100: '#e4d9ff',
          200: '#ccb8ff',
          300: '#bd9dff',
          400: '#b28cff',
          500: '#a67aff',
          600: '#8a4cfc',
          700: '#7c3aed',
          800: '#6420d9',
          900: '#3c0089',
        },
        dark: {
          100: '#262528',
          200: '#1f1f22',
          300: '#19191c',
          400: '#131315',
          500: '#0e0e10',
        },
        surface: {
          100: '#2c2c2f',
          200: '#262528',
          300: '#1f1f22',
          400: '#19191c',
          500: '#131315',
        },
        accent: {
          orange: '#fd761a',
          blue: '#3b82f6',
          red: '#ff6e84',
          green: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'glow-orange': 'glowOrange 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'score-reveal': 'scoreReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'flame-flicker': 'flameFlicker 0.5s ease-in-out infinite alternate',
        float: 'float 3s ease-in-out infinite',
        'confetti-fall': 'confettiFall 1s ease-out forwards',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px rgba(138, 76, 252, 0.3), 0 0 20px rgba(138, 76, 252, 0.15)' },
          to: { boxShadow: '0 0 20px rgba(138, 76, 252, 0.5), 0 0 40px rgba(138, 76, 252, 0.25), 0 0 60px rgba(138, 76, 252, 0.1)' },
        },
        glowOrange: {
          from: { boxShadow: '0 0 10px rgba(253, 118, 26, 0.3), 0 0 20px rgba(253, 118, 26, 0.15)' },
          to: { boxShadow: '0 0 20px rgba(253, 118, 26, 0.5), 0 0 40px rgba(253, 118, 26, 0.25)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        scoreReveal: {
          '0%': { opacity: '0', transform: 'scale(0)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },
        flameFlicker: {
          '0%': { transform: 'scale(1) rotate(-2deg)' },
          '100%': { transform: 'scale(1.1) rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        confettiFall: {
          '0%': { opacity: '1', transform: 'translateY(-20px) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateY(100vh) rotate(720deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0e0e10 0%, #19191c 50%, #1a1020 100%)',
        'arena-gradient': 'linear-gradient(135deg, #bd9dff 0%, #b28cff 100%)',
        'roast-gradient': 'linear-gradient(135deg, #fd761a 0%, #ff6e84 100%)',
        'debate-gradient': 'linear-gradient(135deg, #3b82f6 0%, #bd9dff 100%)',
      },
    },
  },
  plugins: [],
};