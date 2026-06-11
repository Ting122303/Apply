/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 莫兰迪蓝白基调
        'app-bg': '#dce6f2',
        'app-sidebar': '#c2cddb',
        'app-card': '#ffffff',
        'app-card-tint': '#f5f7fa',
        'app-border': '#c8d2de',
        'app-border-light': '#d5dde6',
        'app-text': '#1e2530',
        'app-text-secondary': '#4a5568',
        'app-text-muted': '#7b8799',
        // 强调色
        'app-accent': '#7c8da3',
        'app-accent-light': '#edf1f6',
        'app-accent-hover': '#62738b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'app': '10px',
        'app-sm': '7px',
      },
    },
  },
  plugins: [],
}
