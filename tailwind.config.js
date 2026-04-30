/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        accent: '#6366F1',
        dark: '#0F172A',
        background: '#F0F4FF',
      },
      fontFamily: {
        syne: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      animation: {
        'pop-in': 'popIn 0.4s ease',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

// Made with Bob
