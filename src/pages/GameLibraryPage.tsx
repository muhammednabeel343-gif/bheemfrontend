import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useFavorites from '../hooks/useFavorites'
import { getGames } from '../services/gameService'
import type { GameSummary } from '../types/game'
import GameCard from '../components/GameCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

function GameLibraryPage() {
  const { token } = useAuth()
  const { loading: favoritesLoading } = useFavorites()

  const [games, setGames] = useState<GameSummary[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pageCount = useMemo(() => Math.ceil(total / 20), [total])

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        games
          .map((game: any) => game.category || game.genre)
          .filter(Boolean)
      )
    ).sort()
  }, [games])

  useEffect(() => {
    const loadGames = async () => {
      if (!token) return

      setLoading(true)
      setError('')

      try {
        const response = await getGames(
          token,
          search,
          category,
          page,
          20
        )

        setGames(response.games)
        setTotal(response.total)
      } catch (err) {
        setError('Unable to load games at the moment.')
      } finally {
        setLoading(false)
      }
    }

    void loadGames()
  }, [token, search, category, page])

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with title and filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Game Library
            </h1>
            <p className="text-gaming-secondary">
              Browse games and save your favorites for later.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
            <div className="w-full sm:w-auto max-w-md">
              <SearchBar
                value={search}
                onSearch={(value) => {
                  setPage(1)
                  setSearch(value)
                }}
              />
            </div>

            <CategoryFilter
              categories={categories}
              value={category}
              onSelect={(value) => {
                setPage(1)
                setCategory(value)
              }}
            />
          </div>
        </div>

        {/* Games grid and pagination */}
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-status-not-recommended/30 bg-status-not-recommended/10 p-4 text-sm text-status-not-recommended">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
              <p className="mt-4 text-gaming-secondary">Loading games…</p>
            </div>
          ) : games.length === 0 ? (
            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
              <p className="text-gaming-secondary">No games found. Try another search or category.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {Array.from(
                { length: pageCount },
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index + 1)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      page === index + 1
                        ? 'bg-gaming-accent text-white shadow-glow'
                        : 'bg-gaming-card text-gaming-secondary hover:text-gaming-accent hover:bg-gaming-surface border border-gaming-accent/20'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameLibraryPage