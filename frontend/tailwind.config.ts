// tailwind.config.js
import plugin from 'tailwindcss/plugin'

export default {
  theme: {
    extend: {
      // Mantendo as configurações originais do tema
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.shadow-subtle': {
          'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
        '.shadow-card': {
          'box-shadow': '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        '.shadow-elevated': {
          'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.12)',
        },
      })
    }),
    
    // Pode adicionar outros plugins personalizados aqui
    plugin(function({ addUtilities }) {
      addUtilities({
        '.animate-accordion-down': {
          'animation': 'accordion-down 0.2s ease-out',
        },
        '.animate-accordion-up': {
          'animation': 'accordion-up 0.2s ease-out',
        },
        '.animate-fade-in': {
          'animation': 'fade-in 0.3s ease-out',
        },
        '.animate-fade-out': {
          'animation': 'fade-out 0.3s ease-out',
        },
        '.animate-slide-in-up': {
          'animation': 'slide-in-up 0.4s ease-out',
        },
        '.animate-slide-in-right': {
          'animation': 'slide-in-right 0.4s ease-out',
        },
        '.animate-float': {
          'animation': 'float 6s ease-in-out infinite',
        },
        '.animate-pulse-gentle': {
          'animation': 'pulse-gentle 3s ease-in-out infinite',
        },
        '.bg-gradient-radial': {
          'background-image': 'radial-gradient(var(--tw-gradient-stops))',
        },
        '.bg-gradient-conic': {
          'background-image': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        '.bg-gradient-subtle': {
          'background-image': 'linear-gradient(to right, var(--background), var(--muted), var(--background))',
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
      })
    }),
  ],
}