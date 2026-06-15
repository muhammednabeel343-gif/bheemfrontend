import { Calendar, GamepadIcon } from 'lucide-react'
import type { PurchasedGame } from '../services/purchaseService'

interface Props {
  game: PurchasedGame
}

export default function PurchasedGamesCard({ game }: Props) {
  const purchaseDate = new Date(game.purchase_date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group relative rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm hover:border-gaming-accent/50 transition-all duration-300 hover:shadow-glow flex flex-col overflow-hidden">
      {/* Image Container with padding for visible gap */}
      <div className="p-3">
        <div className="relative rounded-lg overflow-hidden bg-gaming-surface">
          <div className="w-full h-56 sm:h-64">
            {game.image_url ? (
              <img
                src={game.image_url}
                alt={game.game_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gaming-surface">
                <GamepadIcon size={48} className="text-gaming-secondary/50" />
              </div>
            )}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-gaming-accent transition-colors">
            {game.game_name}
          </h3>
          {game.genre && (
            <p className="text-xs text-gaming-secondary mt-1">
              {game.genre}
            </p>
          )}
        </div>

        {/* Purchase Date */}
        <div className="flex items-center gap-2 text-sm text-gaming-secondary mt-3">
          <Calendar size={14} />
          <span>Purchased {purchaseDate}</span>
        </div>
      </div>

      {/* Badge */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gaming-accent/90 text-white text-xs font-bold">
        Owned
      </div>
    </article>
  )
}
