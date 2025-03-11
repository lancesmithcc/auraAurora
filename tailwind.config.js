/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define custom colors for emotions
        joy: '#FFD700', // Gold
        sadness: '#4682B4', // Steel Blue
        anger: '#FF4500', // Red Orange
        fear: '#800080', // Purple
        surprise: '#00FFFF', // Cyan
        disgust: '#32CD32', // Lime Green
        contempt: '#A52A2A', // Brown
        neutral: '#808080', // Gray
      },
    },
  },
  plugins: [],
} 