import { Heart, Calendar, User } from 'lucide-react'
import type { GameDetail } from '../../types/game'

interface Props {
  game: GameDetail
  isFavorite: boolean
  onFavoriteToggle: () => void
}

export default function GameHero({ game, isFavorite, onFavoriteToggle }: Props) {
  const imageUrl = game.image_url?.startsWith('http')
    ? game.image_url
    : game.image_url?.startsWith('/uploads/')
      ? `${import.meta.env.VITE_API_BASE_URL || window.location.origin}${game.image_url}`
      : 'https://via.placeholder.com/1200x400?text=Game'

  return (
    <div className="relative rounded-xl overflow-hidden border border-gaming-accent/20 bg-gaming-surface">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={game.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-surface via-gaming-surface/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 sm:p-12">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
          {/* Cover Image */}
          <div className="flex-shrink-0 w-full sm:w-48">
            <img
              src={imageUrl}
              alt={game.name}
              className="w-full rounded-lg shadow-xl border border-gaming-accent/30 aspect-[2/3] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Genre Badge */}
            {game.genre && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-gaming-accent/20 text-gaming-accent text-xs font-semibold">
                  {game.genre}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {game.name}
            </h1>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
              {game.publisher && (
                <div className="flex items-center gap-3 text-gaming-secondary">
                  <User size={18} />
                  <span>{game.publisher}</span>
                </div>
              )}

              {game.release_date && (
                <div className="flex items-center gap-3 text-gaming-secondary">
                  <Calendar size={18} />
                  <span>{new Date(game.release_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={onFavoriteToggle}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'bg-status-not-recommended hover:bg-status-not-recommended/80 text-white'
                  : 'bg-gaming-accent hover:bg-gaming-accent/80 text-white'
              } shadow-glow`}
            >
              <Heart
                size={20}
                className={isFavorite ? 'fill-white' : ''}
              />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
