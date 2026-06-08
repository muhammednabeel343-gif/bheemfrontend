import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantStyles = {
  default: 'border-gaming-accent/20 hover:border-gaming-accent/50',
  accent: 'border-gaming-accent/30 hover:border-gaming-accent',
  success: 'border-status-excellent/30 hover:border-status-excellent',
  warning: 'border-status-playable/30 hover:border-status-playable',
  danger: 'border-status-not-recommended/30 hover:border-status-not-recommended',
}

const iconColors = {
  default: 'text-gaming-accent',
  accent: 'text-gaming-accent-hover',
  success: 'text-status-excellent',
  warning: 'text-status-playable',
  danger: 'text-status-not-recommended',
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`
        p-6 rounded-xl border bg-gaming-card/50 backdrop-blur-sm
        transition-all duration-300 hover:shadow-glow
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="flex-1">
          <p className="text-gaming-secondary text-sm font-medium mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl md:text-4xl font-bold text-white">
              {value}
            </p>
            {trend && trendValue && (
              <span
                className={`text-sm font-semibold ${
                  trend === 'up'
                    ? 'text-status-excellent'
                    : trend === 'down'
                      ? 'text-status-not-recommended'
                      : 'text-gaming-secondary'
                }`}
              >
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trendValue}
              </span>
            )}
          </div>
        </div>

        {/* Icon */}
        {icon && (
          <div className={`p-3 rounded-lg bg-gaming-accent/10 ${iconColors[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
