import { AlertCircle, Home } from 'lucide-react'
import Button from '../Button/Button'

// Spinner Component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'accent' | 'white'
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

const colorMap = {
  accent: 'border-gaming-accent border-t-transparent',
  white: 'border-white border-t-transparent',
}

export function Spinner({ size = 'md', color = 'accent' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 ${sizeMap[size]} ${colorMap[color]}`}
      />
    </div>
  )
}

// Skeleton Component
interface SkeletonProps {
  count?: number
  height?: string
  circle?: boolean
  className?: string
}

export function Skeleton({
  count = 1,
  height = 'h-4',
  circle = false,
  className = '',
}: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            animate-pulse rounded
            bg-gradient-to-r from-gaming-surface via-gaming-card to-gaming-surface
            ${circle ? 'rounded-full' : ''}
            ${height}
            ${className}
          `}
        />
      ))}
    </div>
  )
}

// EmptyState Component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4
        rounded-xl border border-gaming-accent/20
        bg-gaming-surface/30
        ${className}
      `}
    >
      <div className="text-gaming-accent/50 mb-4">
        {icon || <Home size={48} />}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

      {description && (
        <p className="text-gaming-secondary text-center max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick} size="md">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// ErrorState Component
interface ErrorStateProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  retry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  action,
  retry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4
        rounded-xl border border-status-not-recommended/30
        bg-status-not-recommended/10
        ${className}
      `}
    >
      <div className="text-status-not-recommended mb-4">
        <AlertCircle size={48} />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

      <p className="text-gaming-secondary text-center max-w-sm mb-6">
        {message}
      </p>

      <div className="flex gap-3">
        {retry && (
          <Button variant="secondary" onClick={retry}>
            Try Again
          </Button>
        )}
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Loading Card Component
interface LoadingCardProps {
  count?: number
}

export function LoadingCard({ count = 3 }: LoadingCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-gaming-card border border-gaming-accent/20 overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-gradient-to-r from-gaming-surface via-gaming-card to-gaming-surface" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <Skeleton height="h-4" className="w-3/4" />
            <Skeleton height="h-3" className="w-full" />
            <Skeleton height="h-3" className="w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Page Loading Component
export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="text-gaming-secondary mt-4">Loading...</p>
    </div>
  )
}
