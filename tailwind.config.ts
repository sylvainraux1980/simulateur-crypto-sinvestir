import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f1a',
        'bg-end': '#0d1529',
        sidebar: '#0f1420',
        panel: '#0f1420',
        'panel-border': '#1e2a3a',
        accent: '#f9d147',
        'btn-blue': '#2563eb',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      screens: {
        'md2': '830px',
      },
    },
  },
  plugins: [],
};

export default config;
