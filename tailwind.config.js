/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          app: 'var(--color-bg-app)',
          surface: 'var(--color-bg-surface)',
          subtle: 'var(--color-bg-subtle)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          active: 'var(--color-border-active)',
        },
        text: {
          main: 'var(--color-text-main)',
          sub: 'var(--color-text-sub)',
          muted: 'var(--color-text-muted)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        danger: {
          DEFAULT: 'var(--color-danger, #ef4444)',
          hover: 'var(--color-danger-hover, #dc2626)',
        },
        success: {
          DEFAULT: 'var(--color-success, #10b981)',
        },
        warning: {
          DEFAULT: 'var(--color-warning, #f59e0b)',
        }
      },
      height: {
        header: 'var(--height-header)',
        footer: 'var(--height-footer)',
      },
      spacing: {
        header: 'var(--height-header)',
        footer: 'var(--height-footer)',
      }
    },
  },
  plugins: [],
}
