import type { GameSummary } from '../types/game'
import { memo } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getGameImageSrc, handleGameImageError } from '../utils/imageHelpers'
import useFavorites from '../hooks/useFavorites'

interface Props {
  game: GameSummary
}

function GameCardInner({ game }: Props) {
  const navigate = useNavigate()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorite = isFavorite(game.id)

  const handleCardClick = () => {
    navigate(`/game/${game.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    favorite ? removeFavorite(game.id) : addFavorite(game.id)
  }

  return (
    <article
      onClick={handleCardClick}
      className="group relative rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm hover:border-gaming-accent/50 transition-all duration-300 hover:shadow-glow transform hover:scale-105 cursor-pointer flex flex-col"
    >
      {/* Image wrapper with padding to create a visible gap */}
      <div className="p-3 bg-transparent">
        <div className="relative rounded-lg overflow-hidden bg-gaming-surface" style={{minHeight: 0}}>
          <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80">
            <img
              src={getGameImageSrc(game.image_url)}
              alt={game.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={handleGameImageError}
            />
          </div>

          {/* Favorite Button - offset slightly from the image edge */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 z-10 ${
              favorite
                ? 'bg-status-not-recommended/80 hover:bg-status-not-recommended'
                : 'bg-black/40 hover:bg-black/60 backdrop-blur-sm'
            }`}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={favorite ? 'fill-white text-white' : 'text-white'}
            />
          </button>

          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2 flex-1 flex flex-col justify-end">
        <div>
          <h3 className="font-bold text-base text-white line-clamp-2 group-hover:text-gaming-accent transition-colors">
            {game.name}
          </h3>
          <p className="text-xs text-gaming-secondary mt-1">
            {game.genre}
          </p>
        </div>
      </div>
    </article>
  )
}

export const GameCard = memo(GameCardInner)
export default GameCard
