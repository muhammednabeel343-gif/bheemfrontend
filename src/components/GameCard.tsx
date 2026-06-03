import type { GameSummary } from '../types/game'
import useFavorites from '../hooks/useFavorites'

interface Props {
  game: GameSummary
}

function GameCard({ game }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorite = isFavorite(game.id)

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <img
        src={game.image_url || 'https://via.placeholder.com/420x236?text=Game'}
        alt={game.name}
        className="h-95 w-full object-cover object-center"
        onError={(e) => {
          e.currentTarget.src =
            'https://via.placeholder.com/420x236?text=No+Image'
        }}
      />

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {game.name}
            </h3>

            <p className="text-sm text-slate-500">
              {game.genre}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              favorite
                ? removeFavorite(game.id)
                : addFavorite(game.id)
            }
            className={`rounded-2xl px-3 py-2 text-sm transition ${
              favorite
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {favorite ? 'Remove' : 'Favorite'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default GameCard