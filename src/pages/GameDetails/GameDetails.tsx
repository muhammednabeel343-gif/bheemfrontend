import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import useFavorites from '../../hooks/useFavorites'
import { getGameDetails, getGameDetails as getGameDetailsFromService } from '../../services/gameService'
import { getSystemScan, getCompatibilityReport } from '../../services/systemService'
import type { GameDetail, SystemScan, CompatibilityReport } from '../../types/game'
import GameHero from './GameHero'
import RequirementCard from './RequirementCard'
import CompatibilityReportCard from './CompatibilityReportCard'
import RelatedGames from './RelatedGames'
import { ArrowLeft } from 'lucide-react'

export default function GameDetails() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const [game, setGame] = useState<GameDetail | null>(null)
  const [userSystem, setUserSystem] = useState<SystemScan | null>(null)
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const gameIdNum = gameId ? parseInt(gameId) : 0

  useEffect(() => {
    const loadData = async () => {
      if (!token || !gameIdNum) return

      try {
        setLoading(true)
        setError('')

        // Fetch game details
        const gameData = await getGameDetailsFromService(token, gameIdNum)
        setGame(gameData)

        // Fetch user's system
        const systemData = await getSystemScan(token)
        setUserSystem(systemData)

        // Fetch compatibility report
        try {
          const compatData = await getCompatibilityReport(token, gameIdNum)
          setCompatibility(compatData)
        } catch (compatErr) {
          console.warn('Could not fetch compatibility report:', compatErr)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load game details')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, gameIdNum])

  const handleFavorite = () => {
    if (isFavorite(gameIdNum)) {
      removeFavorite(gameIdNum)
    } else {
      addFavorite(gameIdNum)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
            <p className="mt-4 text-gaming-secondary">Loading game details…</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gaming-accent hover:text-gaming-accent/80 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="rounded-xl border border-status-not-recommended/30 bg-status-not-recommended/10 p-8 text-center">
            <p className="text-status-not-recommended">
              {error || 'Game not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      {/* Back Button */}
      <div className="border-b border-gaming-accent/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gaming-accent hover:text-gaming-accent/80 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <GameHero
          game={game}
          isFavorite={isFavorite(gameIdNum)}
          onFavoriteToggle={handleFavorite}
        />

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Compatibility Report */}
            {compatibility && (
              <CompatibilityReportCard
                report={compatibility}
                userSystem={userSystem}
              />
            )}

            {/* System Requirements */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                System Requirements
              </h2>
              <div className="space-y-4">
                {game.requirements.map((req, idx) => (
                  <RequirementCard key={idx} requirement={req} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Info Card */}
            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
              <h3 className="font-bold text-white text-sm mb-4">Game Info</h3>

              {game.publisher && (
                <div className="mb-4 pb-4 border-b border-gaming-accent/10">
                  <p className="text-xs text-gaming-secondary mb-1">Publisher</p>
                  <p className="text-sm text-white">{game.publisher}</p>
                </div>
              )}

              {game.release_date && (
                <div className="mb-4 pb-4 border-b border-gaming-accent/10">
                  <p className="text-xs text-gaming-secondary mb-1">Release Date</p>
                  <p className="text-sm text-white">
                    {new Date(game.release_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {game.genre && (
                <div>
                  <p className="text-xs text-gaming-secondary mb-2">Genre</p>
                  <p className="text-sm text-white">{game.genre}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <button
              onClick={handleFavorite}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                isFavorite(gameIdNum)
                  ? 'bg-status-not-recommended/20 hover:bg-status-not-recommended/30 text-status-not-recommended border border-status-not-recommended/30'
                  : 'bg-gaming-accent/20 hover:bg-gaming-accent/30 text-gaming-accent border border-gaming-accent/30'
              }`}
            >
              {isFavorite(gameIdNum) ? '❤️ Favorited' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>

        {/* Related Games */}
        <RelatedGames currentGameId={gameIdNum} genre={game.genre} />
      </div>
    </div>
  )
}
