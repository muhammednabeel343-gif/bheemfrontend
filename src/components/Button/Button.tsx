import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gaming-accent hover:bg-gaming-accent-hover text-white shadow-lg hover:shadow-glow transition-all duration-300',
  secondary:
    'bg-gaming-surface hover:bg-gaming-card text-gaming-accent border border-gaming-accent/30 hover:border-gaming-accent transition-all duration-300',
  danger:
    'bg-red-600/80 hover:bg-red-700 text-white transition-all duration-300',
  ghost:
    'text-gaming-accent hover:bg-gaming-accent/10 transition-all duration-300',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gaming-accent'

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${loading ? 'opacity-75 cursor-wait' : ''}
      ${className}
    `.trim()

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {loading && (
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="flex items-center">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && !loading && (
          <span className="flex items-center">{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
