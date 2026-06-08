import { Star, Zap } from 'lucide-react'

interface GameCardProps {
  id: number
  title: string
  coverImage?: string
  genre: string[]
  compatibility?: number
  rating?: number
  onClick?: () => void
  status?: 'excellent' | 'playable' | 'limited' | 'not-recommended'
}

const statusColors = {
  excellent: 'from-status-excellent to-green-600 text-white',
  playable: 'from-status-playable to-amber-600 text-white',
  limited: 'from-status-limited to-orange-600 text-white',
  'not-recommended': 'from-status-not-recommended to-red-600 text-white',
}

const statusLabels = {
  excellent: 'Excellent',
  playable: 'Playable',
  limited: 'Limited',
  'not-recommended': 'Not Recommended',
}

function GameCard({
  id,
  title,
  coverImage,
  genre,
  compatibility = 0,
  rating = 0,
  onClick,
  status = 'playable',
}: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-gaming-card border border-gaming-accent/20 hover:border-gaming-accent/50 transition-all duration-300 cursor-pointer hover:shadow-glow transform hover:scale-105 aspect-[2/3]"
    >
      {/* Cover Image */}
      <div className="absolute inset-0 overflow-hidden bg-gaming-surface">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-gaming-accent/30 to-gaming-accent/10 flex items-center justify-center">
            <Zap size={48} className="text-gaming-accent/50" />
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-semibold">View Details</p>
            <p className="text-gaming-secondary text-sm">Click to explore</p>
          </div>
        </div>

        {/* Status Badge */}
        {status && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${statusColors[status]} shadow-lg`}>
            {statusLabels[status]}
          </div>
        )}

        {/* Compatibility Percentage */}
        {compatibility > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gaming-accent">
            {compatibility}%
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
        {/* Title */}
        <h3 className="font-bold text-lg text-white line-clamp-2 mb-2 group-hover:text-gaming-accent transition-colors">
          {title}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-1 bg-gaming-accent/20 text-gaming-accent rounded-md"
            >
              {g}
            </span>
          ))}
          {genre.length > 2 && (
            <span className="text-xs px-2 py-1 bg-gaming-surface text-gaming-secondary rounded-md">
              +{genre.length - 2}
            </span>
          )}
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 text-gaming-secondary text-sm">
            <Star size={14} className="fill-gaming-accent text-gaming-accent" />
            <span>{rating.toFixed(1)}/5</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameCard
