import React from 'react'
import { Check, AlertCircle, X } from 'lucide-react'

interface CompatibilityBadgeProps {
  status: 'excellent' | 'playable' | 'limited' | 'not-recommended'
  percentage?: number
  size?: 'sm' | 'md' | 'lg'
}

const compatibilityStyles = {
  excellent: {
    bg: 'bg-status-excellent/20',
    text: 'text-status-excellent',
    border: 'border-status-excellent/40',
    icon: 'Check',
  },
  playable: {
    bg: 'bg-status-playable/20',
    text: 'text-status-playable',
    border: 'border-status-playable/40',
    icon: 'Check',
  },
  limited: {
    bg: 'bg-status-limited/20',
    text: 'text-status-limited',
    border: 'border-status-limited/40',
    icon: 'AlertCircle',
  },
  'not-recommended': {
    bg: 'bg-status-not-recommended/20',
    text: 'text-status-not-recommended',
    border: 'border-status-not-recommended/40',
    icon: 'X',
  },
}

const statusLabels = {
  excellent: 'Excellent',
  playable: 'Playable',
  limited: 'Limited',
  'not-recommended': 'Not Recommended',
}

const sizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
}

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
}

function CompatibilityBadge({
  status,
  percentage,
  size = 'md',
}: CompatibilityBadgeProps) {
  const style = compatibilityStyles[status]
  const label = statusLabels[status]
  const IconComponent =
    style.icon === 'Check'
      ? Check
      : style.icon === 'X'
        ? X
        : AlertCircle

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold ${sizeStyles[size]} ${style.bg} ${style.text} ${style.border}`}
    >
      <IconComponent size={iconSizes[size]} />
      <span>{percentage ? `${percentage}% - ${label}` : label}</span>
    </div>
  )
}

export default CompatibilityBadge

// StatusBadge Component
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const statusBadgeStyles = {
  active: 'bg-status-excellent/20 text-status-excellent border-status-excellent/40',
  inactive: 'bg-gaming-surface text-gaming-secondary border-gaming-accent/20',
  pending: 'bg-status-playable/20 text-status-playable border-status-playable/40',
  error: 'bg-status-not-recommended/20 text-status-not-recommended border-status-not-recommended/40',
}

const statusBadgeLabels = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  error: 'Error',
}

export function StatusBadge({
  status,
  label,
  size = 'md',
}: StatusBadgeProps) {
  return (
    <div
      className={`inline-flex items-center border rounded-lg font-semibold ${sizeStyles[size]} ${statusBadgeStyles[status]}`}
    >
      <div className="w-2 h-2 rounded-full bg-current mr-2" />
      <span>{label || statusBadgeLabels[status]}</span>
    </div>
  )
}

// GenreBadge Component
interface GenreBadgeProps {
  genre: string
  onClick?: () => void
  size?: 'sm' | 'md'
  variant?: 'default' | 'filled'
}

export function GenreBadge({
  genre,
  onClick,
  size = 'sm',
  variant = 'default',
}: GenreBadgeProps) {
  const baseStyles = 'rounded-full font-medium inline-block'
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  const variantStyles =
    variant === 'filled'
      ? 'bg-gaming-accent text-white'
      : 'bg-gaming-accent/20 text-gaming-accent border border-gaming-accent/40'

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeClass} ${variantStyles} hover:brightness-110 transition-all duration-200`}
    >
      {genre}
    </button>
  )
}
