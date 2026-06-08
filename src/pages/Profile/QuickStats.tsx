import { TrendingUp, MessageSquare, Gauge, Heart, Gamepad2 } from 'lucide-react'

interface UserStats {
  total_reports: number
  total_reviews: number
  avg_compatibility: number
  favorite_games_count: number
  games_scanned: number
}

interface Props {
  stats: UserStats
}

export default function QuickStats({ stats }: Props) {
  const statCards = [
    {
      label: 'Total Reports',
      value: stats.total_reports,
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      label: 'Total Reviews',
      value: stats.total_reviews,
      icon: MessageSquare,
      color: 'text-green-400',
    },
    {
      label: 'Avg Compatibility',
      value: `${stats.avg_compatibility}%`,
      icon: Gauge,
      color: 'text-gaming-accent',
    },
    {
      label: 'Favorite Games',
      value: stats.favorite_games_count,
      icon: Heart,
      color: 'text-red-400',
    },
    {
      label: 'Games Scanned',
      value: stats.games_scanned,
      icon: Gamepad2,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-4 text-center"
          >
            <Icon size={24} className={`${stat.color} mx-auto mb-2`} />
            <p className="text-sm text-gaming-secondary mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
