import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useFavorites from '../hooks/useFavorites'
import { getGames } from '../services/gameService'
import type { GameSummary } from '../types/game'
import GameCard from '../components/GameCard'
import SearchBar from '../components/SearchBar'
import CategorySidebar from '../components/CategorySidebar'

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
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Game Library
          </h1>
          <p className="mt-2 text-slate-600">
            Browse games and save your favorites for later.
          </p>
        </div>

        <SearchBar
          value={search}
          onSearch={(value) => {
            setPage(1)
            setSearch(value)
          }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <CategorySidebar
          categories={categories}
          value={category}
          onSelect={(value) => {
            setPage(1)
            setCategory(value)
          }}
        />

        <div className="space-y-4">
          {error && (
            <div className="rounded-3xl bg-rose-100 p-4 text-sm text-rose-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading games…
            </div>
          ) : games.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              No games found. Try another search or category.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from(
                { length: pageCount },
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index + 1)}
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      page === index + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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