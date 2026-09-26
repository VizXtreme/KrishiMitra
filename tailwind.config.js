/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        earth: {
          950: '#111110',
          900: '#191917',
          850: '#1f1e1c',
          800: '#272523',
          700: '#2d2b27',
          600: '#3d3935',
          500: '#4a4640',
        },
        leaf: {
          50: '#e8f2ec',
          100: '#c4e4d0',
          200: '#a8d5b8',
          300: '#8bcca2',
          400: '#5bb37d',
          500: '#3d9b63',
          600: '#2e7d52',
          700: '#266a45',
          800: '#1a4030',
          900: '#152014',
          950: '#0f120c',
        },
        harvest: {
          300: '#e8bf6a',
          400: '#ddb65a',
          500: '#d4a03c',
          600: '#b8862d',
          700: '#9a7026',
          800: '#7a5a20',
          900: '#5c4215',
          950: '#382a0d',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
