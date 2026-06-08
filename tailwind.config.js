export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: '#020617',
          card: '#0F172A',
          surface: '#111827',
          accent: '#8B5CF6',
          'accent-hover': '#7C3AED',
        },
        status: {
          excellent: '#10B981',
          playable: '#F59E0B',
          limited: '#FF8C42',
          'not-recommended': '#EF4444',
        },
        'gaming-bg': '#020617',
        'gaming-card': '#0F172A',
        'gaming-surface': '#111827',
        'gaming-accent': '#8B5CF6',
        'gaming-accent-hover': '#7C3AED',
        'gaming-secondary': '#94A3B8',
        'gaming-tertiary': '#64748B',
      },
      backgroundColor: {
        gaming: '#020617',
        'gaming-bg': '#020617',
        'gaming-card': '#0F172A',
        'gaming-surface': '#111827',
      },
      textColor: {
        gaming: '#FFFFFF',
        'gaming-secondary': '#94A3B8',
        'gaming-tertiary': '#64748B',
      },
      borderColor: {
        gaming: 'rgba(255, 255, 255, 0.1)',
        'gaming-light': 'rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(139, 92, 246, 0.1)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      transitionTimingFunction: {
        'gaming': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
