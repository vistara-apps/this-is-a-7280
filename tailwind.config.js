/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240, 80%, 50%)',
        accent: 'hsl(170, 70%, 45%)',
        bg: 'hsl(220, 15%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(220, 15%, 20%)',
        'text-secondary': 'hsl(220, 15%, 40%)',
        'dark-bg': 'hsl(220, 15%, 8%)',
        'dark-surface': 'hsl(220, 15%, 12%)',
        'dark-text-primary': 'hsl(220, 15%, 95%)',
        'dark-text-secondary': 'hsl(220, 15%, 70%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '24px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 20%, 0.1)',
        'card-dark': '0 4px 12px hsla(220, 15%, 5%, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 20px hsl(240, 80%, 50%)',
          },
          '100%': {
            boxShadow: '0 0 30px hsl(240, 80%, 50%), 0 0 40px hsl(240, 80%, 50%)',
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}