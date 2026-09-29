import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101818',
        teal: {
          300: '#79e4d0',
          400: '#4dd4bd',
          500: '#28bca7',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      maxWidth: {
        content: '1160px',
      },
    },
  },
  plugins: [],
} satisfies Config
