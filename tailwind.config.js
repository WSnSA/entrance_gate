// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        shake: 'shake 0.2s ease-in-out',
      },
      fontFamily: {
        // Use Montserrat first, then Noto Sans for Cyrillic
        sans: ['Montserrat', '"Noto Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        heading: ['Montserrat', '"Noto Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  darkMode: 'media', // эсвэл 'class'
  plugins: [],
}
