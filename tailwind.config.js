/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(16, 24, 40, 0.08)',
        card: '0 8px 24px rgba(15, 23, 42, 0.08)'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%,90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(380%)', opacity: '0' }
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        scan: 'scan 1.8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 1.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
