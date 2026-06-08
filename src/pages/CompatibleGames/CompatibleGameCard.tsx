import { useState } from 'react'
import { Heart, Zap } from 'lucide-react'
import type { GameSummary } from '../../types/game'
import useFavorites from '../../hooks/useFavorites'
import GameCompatibilityModal from './GameCompatibilityModal'

interface Props {
  game: GameSummary
  compatibilityPercentage?: number
  token: string
}

const getStatusColor = (percentage?: number) => {
  if (!percentage) return 'text-gaming-secondary'
  if (percentage >= 90) return 'text-status-excellent'
  if (percentage >= 70) return 'text-status-playable'
  if (percentage >= 50) return 'text-status-limited'
  return 'text-status-not-recommended'
}

const getStatusBg = (percentage?: number) => {
  if (!percentage) return 'bg-gaming-surface/50'
  if (percentage >= 90) return 'bg-status-excellent/10 border-status-excellent/30'
  if (percentage >= 70) return 'bg-status-playable/10 border-status-playable/30'
  if (percentage >= 50) return 'bg-status-limited/10 border-status-limited/30'
  return 'bg-status-not-recommended/10 border-status-not-recommended/30'
}

const getStatusLabel = (percentage?: number) => {
  if (!percentage) return 'Unknown'
  if (percentage >= 90) return 'Excellent'
  if (percentage >= 70) return 'Playable'
  if (percentage >= 50) return 'Limited'
  return 'Not Recommended'
}

export default function CompatibleGameCard({
  game,
  compatibilityPercentage,
  token,
}: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [showModal, setShowModal] = useState(false)
  const favorite = isFavorite(game.id)

  return (
    <>
      <article className="group relative overflow-hidden rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm hover:border-gaming-accent/50 transition-all duration-300 hover:shadow-glow transform hover:scale-105 aspect-[2/3] cursor-pointer">
        {/* Image Container */}
        <div className="absolute inset-0 overflow-hidden bg-gaming-surface">
          <img
            src={
              game.image_url?.startsWith('http')
                ? game.image_url
                : game.image_url?.startsWith('/uploads/')
                  ? `${import.meta.env.VITE_API_BASE_URL || window.location.origin}${game.image_url}`
                  : 'https://via.placeholder.com/640x360?text=Game'
            }
            alt={game.name}
            className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay on Hover */}
          <div
            onClick={() => setShowModal(true)}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-white font-semibold flex items-center justify-center gap-2">
                <Zap size={20} />
                View Details
              </p>
              <p className="text-gaming-secondary text-sm">Click for full report</p>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              favorite ? removeFavorite(game.id) : addFavorite(game.id)
            }}
            className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 z-10 ${
              favorite
                ? 'bg-status-not-recommended/80 hover:bg-status-not-recommended'
                : 'bg-black/40 hover:bg-black/60 backdrop-blur-sm'
            }`}
          >
            <Heart
              size={18}
              className={favorite ? 'fill-white text-white' : 'text-white'}
            />
          </button>

          {/* Compatibility Badge */}
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-sm font-bold border transition-all duration-300 ${getStatusBg(compatibilityPercentage)} ${getStatusColor(compatibilityPercentage)}`}
          >
            {compatibilityPercentage !== undefined ? `${compatibilityPercentage}%` : 'N/A'}
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 bg-gradient-to-t from-black/95 via-black/40 to-transparent cursor-pointer" onClick={() => setShowModal(true)}>
          {/* Title */}
          <div>
            <h3 className="font-bold text-base text-white line-clamp-2 group-hover:text-gaming-accent transition-colors">
              {game.name}
            </h3>
            <p className="text-xs text-gaming-secondary mt-1">
              {game.genre}
            </p>
          </div>

          {/* Compatibility Status */}
          <div className="flex items-center gap-2 pt-2 border-t border-gaming-accent/10">
            <Zap size={14} className={getStatusColor(compatibilityPercentage)} />
            <span className={`text-xs font-semibold ${getStatusColor(compatibilityPercentage)}`}>
              {getStatusLabel(compatibilityPercentage)}
            </span>
          </div>
        </div>
      </article>

      {/* Modal */}
      {showModal && (
        <GameCompatibilityModal
          gameId={game.id}
          gameName={game.name}
          gameImage={game.image_url}
          gameGenre={game.genre}
          onClose={() => setShowModal(false)}
          token={token}
        />
      )}
    </>
  )
}
