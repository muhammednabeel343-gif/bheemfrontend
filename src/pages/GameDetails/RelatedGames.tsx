import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getGames } from '../../services/gameService'
import type { GameSummary } from '../../types/game'
import GameCard from '../../components/GameCard'

interface Props {
  currentGameId: number
  genre?: string
}

export default function RelatedGames({ currentGameId, genre }: Props) {
  const { token } = useAuth()
  const [games, setGames] = useState<GameSummary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadRelatedGames = async () => {
      if (!token || !genre) return

      try {
        setLoading(true)
        const response = await getGames(token, '', genre, 1, 100)
        const related = response.games?.filter(
          (game) => game.id !== currentGameId
        ) || []
        setGames(related.slice(0, 6)) // Show only 6 related games
      } catch (err) {
        console.error('Failed to load related games:', err)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedGames()
  }, [token, genre, currentGameId])

  if (!genre || games.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gaming-accent/10">
      <h2 className="text-2xl font-bold text-white mb-6">
        More {genre} Games
      </h2>

      {loading ? (
        <div className="text-center text-gaming-secondary">
          Loading related games...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
