import React from 'react'
import { AlertCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      success,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gaming-secondary mb-2">
            {label}
            {props.required && <span className="text-status-not-recommended ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gaming-secondary pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-2 rounded-lg
              bg-gaming-surface border
              text-white placeholder-gaming-secondary/50
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gaming-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gaming-bg
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-status-not-recommended focus-visible:ring-status-not-recommended'
                  : success
                    ? 'border-status-excellent focus-visible:ring-status-excellent'
                    : 'border-gaming-accent/30 hover:border-gaming-accent/50'
              }
              ${className}
            `}
            {...props}
          />

          {success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-status-excellent">
              ✓
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-status-not-recommended">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {error && (
          <p className="text-status-not-recommended text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-gaming-secondary text-sm mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string | number; label: string }>
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, placeholder, className = '', ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gaming-secondary mb-2">
            {label}
            {props.required && <span className="text-status-not-recommended ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-lg
            bg-gaming-surface border
            text-white
            transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gaming-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? 'border-status-not-recommended'
                : 'border-gaming-accent/30 hover:border-gaming-accent/50'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-status-not-recommended text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-gaming-secondary text-sm mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

// Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  error?: boolean
  children: React.ReactNode
}

export function Label({ required, error, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`
        block text-sm font-medium
        ${error ? 'text-status-not-recommended' : 'text-gaming-secondary'}
        ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-status-not-recommended ml-1">*</span>}
    </label>
  )
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  success?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, success, className = '', disabled, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gaming-secondary mb-2">
            {label}
            {props.required && <span className="text-status-not-recommended ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-2 rounded-lg
            bg-gaming-surface border
            text-white placeholder-gaming-secondary/50
            transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gaming-accent
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-vertical
            ${
              error
                ? 'border-status-not-recommended'
                : success
                  ? 'border-status-excellent'
                  : 'border-gaming-accent/30 hover:border-gaming-accent/50'
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-status-not-recommended text-sm mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-gaming-secondary text-sm mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
