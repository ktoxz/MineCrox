import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9eeff',
          200: '#b9e0ff',
          300: '#7cc5ff',
          400: '#3ea7ff',
          500: '#178bff',
          600: '#0b70e0',
          700: '#0b59b2',
          800: '#0d4b90',
          900: '#0e3f78'
        }
      }
    }
  },
  plugins: [],
} satisfies Config
