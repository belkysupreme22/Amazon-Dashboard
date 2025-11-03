/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',   
          100: '#ffe6b3',  
          200: '#ffd180',  
          300: '#ffb84d',  
          400: '#ff9900', 
          500: '#e68a00',  
          600: '#b36b00',  
          700: '#804d00',  
          800: '#4d2e00',  
          900: '#1a0f00',  
        },        
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
