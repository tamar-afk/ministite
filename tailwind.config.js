/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        'accent-pink': 'var(--accent-pink)',
        'accent-green': 'var(--accent-green)',
        'accent-amber': 'var(--accent-amber)',
        dark: 'var(--dark)',
        'dark-surface': 'var(--dark-surface)',
        'dark-border': 'var(--dark-border)',
        'light-bg': 'var(--light-bg)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
      },
    },
  },
  plugins: [],
}
