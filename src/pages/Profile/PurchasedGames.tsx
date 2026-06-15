import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import PurchasedGamesCard from '../../components/PurchasedGamesCard'
import { getUserLibrary } from '../../services/purchaseService'
import type { PurchasedGame } from '../../services/purchaseService'
import { Gift, Loader } from 'lucide-react'

export default function PurchasedGames() {
  const { token } = useAuth()
  const [games, setGames] = useState<PurchasedGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGames = async () => {
      if (!token) return

      setLoading(true)
      setError('')

      try {
        const library = await getUserLibrary(token)
        setGames(library.games)
      } catch (err) {
        console.error('Failed to load purchased games:', err)
        setError('Failed to load purchased games')
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [token])

  if (loading) {
    return (
      <div className="mt-8 rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8">
        <div className="flex items-center justify-center gap-3 text-gaming-secondary">
          <Loader size={20} className="animate-spin" />
          Loading your library...
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 mb-12">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gift size={24} />
          My Game Library
        </h2>
        <p className="text-gaming-secondary mt-1">
          {games.length} {games.length === 1 ? 'game' : 'games'} in your library
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-status-not-recommended/20 border border-status-not-recommended text-status-not-recommended">
          {error}
        </div>
      )}

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
          <Gift size={48} className="text-gaming-secondary/50 mx-auto mb-4" />
          <p className="text-lg text-gaming-secondary mb-4">
            You haven't purchased any games yet.
          </p>
          <a
            href="/library"
            className="text-gaming-accent hover:underline font-bold"
          >
            Explore the Game Library
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <PurchasedGamesCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
