import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSystemScan, simulateCompatibility } from '../../services/systemService'
import { getGames } from '../../services/gameService'

interface SystemData {
  cpu: string
  gpu: string
  ram_gb: number
  storage_gb: number
  operating_system?: string | null
}

interface ProjectGame {
  id: number
  name: string
  genre?: string
}

export default function SystemInsights() {
  const { token } = useAuth()
  const [system, setSystem] = useState<SystemData | null>(null)
  const [compatibility, setCompatibility] = useState(0)
  const [recommendedGenres, setRecommendedGenres] = useState<string[]>([])
  const [avoidGenres, setAvoidGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const loadSystemInsights = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Load system data
        const systemData = await getSystemScan(token)
        setSystem(systemData)

        // Fetch all games from library (get multiple pages for better analysis)
        const gamesResponse = await getGames(token, undefined, undefined, 1, 100)
        const allGames = gamesResponse.games || []

        if (allGames.length === 0) {
          setHasData(false)
          setLoading(false)
          return
        }

        const projectGames = allGames

        // Calculate compatibility for each game in project
        const compatibilityResults = await Promise.all(
          projectGames.map(async (game: ProjectGame) => {
            try {
              const report = await simulateCompatibility(token, {
                game_id: game.id,
                cpu: systemData.cpu,
                gpu: systemData.gpu,
                ram_gb: systemData.ram_gb,
                storage_gb: systemData.storage_gb,
                operating_system: systemData.operating_system || 'Windows',
              })
              return {
                ...game,
                compatibility_percentage: report.compatibility_percentage,
              }
            } catch (err) {
              console.error(`Failed to get compatibility for game ${game.id}:`, err)
              return null
            }
          })
        )

        const validResults = compatibilityResults.filter((r) => r !== null)

        if (validResults.length === 0) {
          setHasData(false)
          setLoading(false)
          return
        }

        // Group by genre and calculate stats
        const genreStats: {
          [key: string]: { total: number; count: number }
        } = {}

        validResults.forEach((game: any) => {
          if (game.genre && game.compatibility_percentage) {
            const genres = game.genre
              .split(',')
              .map((g: string) => g.trim())
              .filter((g: string) => g.length > 0)

            genres.forEach((genre: string) => {
              if (!genreStats[genre]) {
                genreStats[genre] = { total: 0, count: 0 }
              }
              genreStats[genre].total += game.compatibility_percentage
              genreStats[genre].count += 1
            })
          }
        })

        // Calculate averages
        const genreAverages = Object.entries(genreStats)
          .map(([genre, stats]) => ({
            genre,
            avgCompatibility: Math.round(stats.total / stats.count),
          }))
          .sort((a, b) => b.avgCompatibility - a.avgCompatibility)

        if (genreAverages.length > 0) {
          // Recommended: genres with high compatibility (>= 70%)
          const recommended = genreAverages
            .filter((g) => g.avgCompatibility >= 70)
            .slice(0, 4)
            .map((g) => g.genre)

          // Avoid: genres with low compatibility (< 70%)
          const avoid = genreAverages
            .filter((g) => g.avgCompatibility < 70)
            .slice(0, 2)
            .map((g) => g.genre)

          // Overall average
          const overallCompat = Math.round(
            validResults.reduce(
              (sum: number, game: any) => sum + (game.compatibility_percentage || 0),
              0
            ) / validResults.length
          )

          setCompatibility(overallCompat)
          setRecommendedGenres(recommended)
          setAvoidGenres(avoid)
          setHasData(recommended.length > 0 || avoid.length > 0)
        } else {
          setHasData(false)
        }
      } catch (err) {
        console.error('Failed to load system insights:', err)
        setHasData(false)
      } finally {
        setLoading(false)
      }
    }

    loadSystemInsights()
  }, [token])

  if (loading || !system) {
    return (
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-gaming-accent" />
            <h2 className="text-xl font-bold text-white">About Your System</h2>
          </div>
        </div>
        <p className="text-gaming-secondary">Loading system insights...</p>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-gaming-accent" />
            <h2 className="text-xl font-bold text-white">About Your System</h2>
          </div>
        </div>
        <p className="text-gaming-secondary">
          Analyzing all games in the library to show personalized recommendations based on compatibility with your system.
        </p>
      </div>
    )
  }

  const summary =
    recommendedGenres.length > 0
      ? `Based on all games in the library, your PC shows ${compatibility >= 80 ? 'excellent' : compatibility >= 60 ? 'good' : 'fair'} performance. You do best with ${recommendedGenres.slice(0, 2).join(' and ')} games.`
      : `Based on all games in the library, your PC has an average compatibility of ${compatibility}%.`

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap size={24} className="text-gaming-accent" />
          <h2 className="text-xl font-bold text-white">About Your System</h2>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gaming-secondary mb-6 leading-relaxed">{summary}</p>

      {/* Compatibility Score */}
      <div className="mb-6 p-4 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gaming-secondary">Average Compatibility</p>
          <p className="text-2xl font-bold text-gaming-accent">{compatibility}%</p>
        </div>
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gaming-accent transition-all duration-300"
            style={{ width: `${compatibility}%` }}
          ></div>
        </div>
      </div>

      {/* Genres Grid */}
      {(recommendedGenres.length > 0 || avoidGenres.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {recommendedGenres.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-green-400 mb-3">
                Recommended Genres
              </h3>
              <div className="space-y-2">
                {recommendedGenres.map((genre) => (
                  <div key={genre} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-white">{genre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {avoidGenres.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-orange-400 mb-3">
                Genres to Avoid
              </h3>
              <div className="space-y-2">
                {avoidGenres.map((genre) => (
                  <div key={genre} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-white">{genre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
