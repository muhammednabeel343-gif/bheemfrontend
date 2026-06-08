import { Star, ThumbsUp, Flag } from 'lucide-react'

interface ReviewCardProps {
  id: number
  author: string
  avatar?: string
  rating: number
  title: string
  content: string
  hardware?: {
    cpu?: string
    gpu?: string
    ram?: number
    os?: string
  }
  fps?: number
  helpfulCount?: number
  date: string
  onHelpful?: () => void
  onReport?: () => void
}

function ReviewCard({
  id,
  author,
  avatar,
  rating,
  title,
  content,
  hardware,
  fps,
  helpfulCount = 0,
  date,
  onHelpful,
  onReport,
}: ReviewCardProps) {
  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6 hover:border-gaming-accent/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gaming-accent/30 flex items-center justify-center text-gaming-accent font-bold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">{author}</p>
            <p className="text-gaming-secondary text-xs">{date}</p>
          </div>
        </div>

        {/* Report Button */}
        {onReport && (
          <button
            onClick={onReport}
            className="p-2 rounded-lg text-gaming-secondary hover:text-status-not-recommended hover:bg-gaming-surface transition-colors"
            title="Report review"
          >
            <Flag size={16} />
          </button>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < rating
                  ? 'fill-status-playable text-status-playable'
                  : 'text-gaming-surface'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-white">{rating}/5</span>
      </div>

      {/* Title */}
      {title && (
        <h4 className="font-semibold text-white mb-2">{title}</h4>
      )}

      {/* Content */}
      <p className="text-gaming-secondary text-sm leading-relaxed mb-4 line-clamp-3">
        {content}
      </p>

      {/* Hardware & Performance */}
      {(hardware || fps) && (
        <div className="mb-4 p-3 bg-gaming-surface/50 rounded-lg space-y-2">
          {hardware && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {hardware.gpu && (
                <div>
                  <span className="text-gaming-secondary">GPU:</span>
                  <p className="text-gaming-accent font-medium">{hardware.gpu}</p>
                </div>
              )}
              {hardware.cpu && (
                <div>
                  <span className="text-gaming-secondary">CPU:</span>
                  <p className="text-gaming-accent font-medium">{hardware.cpu}</p>
                </div>
              )}
              {hardware.ram && (
                <div>
                  <span className="text-gaming-secondary">RAM:</span>
                  <p className="text-gaming-accent font-medium">{hardware.ram}GB</p>
                </div>
              )}
              {hardware.os && (
                <div>
                  <span className="text-gaming-secondary">OS:</span>
                  <p className="text-gaming-accent font-medium">{hardware.os}</p>
                </div>
              )}
            </div>
          )}
          {fps && (
            <div className="border-t border-gaming-accent/10 pt-2">
              <span className="text-gaming-secondary text-xs">Reported FPS:</span>
              <p className="text-gaming-accent font-semibold">{fps} FPS</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {onHelpful ? (
          <button
            onClick={onHelpful}
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-gaming-secondary hover:text-gaming-accent hover:bg-gaming-surface transition-colors text-sm"
          >
            <ThumbsUp size={14} />
            <span>Helpful ({helpfulCount})</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 text-gaming-secondary text-sm">
            <ThumbsUp size={14} />
            <span>{helpfulCount} helpful</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewCard
