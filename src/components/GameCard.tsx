import type { GameSummary } from '../types/game'
import useFavorites from '../hooks/useFavorites'
import { memo } from 'react'
import { Heart, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  game: GameSummary
}

function GameCardInner({ game }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorite = isFavorite(game.id)

  return (
    <Link to={`/games/${game.id}`}>
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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            favorite ? removeFavorite(game.id) : addFavorite(game.id)
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 ${
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
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
        {/* Title */}
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
    </Link>
  )
}

export const GameCard = memo(GameCardInner)
export default GameCard
