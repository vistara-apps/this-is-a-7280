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
        primary: 'hsl(240, 80%, 50%)',
        accent: 'hsl(170, 70%, 45%)',
        background: 'hsl(220, 15%, 8%)',
        surface: 'hsl(220, 15%, 12%)',
        'surface-light': 'hsl(220, 15%, 16%)',
        'text-primary': 'hsl(220, 15%, 95%)',
        'text-secondary': 'hsl(220, 15%, 70%)',
        'text-muted': 'hsl(220, 15%, 50%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 0%, 0.3)',
        'glow': '0 0 20px hsla(240, 80%, 50%, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px hsla(240, 80%, 50%, 0.3)' },
          '50%': { boxShadow: '0 0 30px hsla(240, 80%, 50%, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}