/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#111827',
        surfaceHover: '#1F2937',
        border: '#1F2937',
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          DEFAULT: '#F97316'
        },
        festive: {
          gold: '#F59E0B',
          diya: '#D97706',
          crimson: '#EF4444',
          emerald: '#10B981',
          royal: '#8B5CF6',
          cyan: '#06B6D4'
        }
      }
    },
  },
  plugins: [],
}
