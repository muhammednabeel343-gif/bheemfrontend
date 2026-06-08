import GameCard from '../../components/GameCard'
import type { GameSummary } from '../../types/game'

interface Props {
  games: GameSummary[]
}

export default function GameGrid({ games }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
