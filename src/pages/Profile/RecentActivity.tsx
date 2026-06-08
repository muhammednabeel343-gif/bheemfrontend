import { useState } from 'react'
import { Zap, MessageSquare, ArrowRight } from 'lucide-react'

interface Props {
  isOwnProfile: boolean
}

export default function RecentActivity({ isOwnProfile }: Props) {
  const [activeTab, setActiveTab] = useState<'reports' | 'reviews'>('reports')

  // TODO: Load from actual activity data
  const recentReports = [
    { id: 1, game: 'Cyberpunk 2077', compatibility: 95, timestamp: '2 hours ago' },
    { id: 2, game: 'Valorant', compatibility: 100, timestamp: '1 day ago' },
    { id: 3, game: 'The Witcher 3', compatibility: 92, timestamp: '3 days ago' },
    { id: 4, game: 'Starfield', compatibility: 75, timestamp: '1 week ago' },
    { id: 5, game: 'Alan Wake 2', compatibility: 45, timestamp: '2 weeks ago' },
  ]

  const recentReviews = [
    { id: 1, game: 'Cyberpunk 2077', rating: 5, text: 'Runs perfectly!', timestamp: '2 days ago' },
    { id: 2, game: 'Starfield', rating: 4, text: 'Good but needs optimization', timestamp: '5 days ago' },
    { id: 3, game: 'Valorant', rating: 5, text: 'Excellent performance', timestamp: '1 week ago' },
  ]

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8">
      <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gaming-accent/10">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'reports'
              ? 'border-gaming-accent text-gaming-accent'
              : 'border-transparent text-gaming-secondary hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap size={18} />
            Latest Scans
          </div>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-medium transition-all duration-300 border-b-2 ${
            activeTab === 'reviews'
              ? 'border-gaming-accent text-gaming-accent'
              : 'border-transparent text-gaming-secondary hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            Latest Reviews
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-6">
        {activeTab === 'reports' ? (
          recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 hover:border-gaming-accent/30 transition-all duration-200 cursor-pointer"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{report.game}</p>
                <p className="text-xs text-gaming-secondary mt-0.5">{report.timestamp}</p>
              </div>
              <div className="text-right ml-4">
                <p className={`text-lg font-bold ${getCompatibilityColor(report.compatibility)}`}>
                  {report.compatibility}%
                </p>
              </div>
            </div>
          ))
        ) : (
          recentReviews.map((review) => (
            <div
              key={review.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 hover:border-gaming-accent/30 transition-all duration-200 cursor-pointer"
            >
              <div className="text-sm text-amber-400">
                {'★'.repeat(review.rating)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{review.game}</p>
                <p className="text-xs text-gaming-secondary line-clamp-2 mt-1">
                  {review.text}
                </p>
                <p className="text-xs text-gaming-secondary mt-1">{review.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      <button className="w-full px-4 py-2 rounded-lg bg-gaming-surface hover:bg-gaming-accent/20 text-gaming-secondary hover:text-gaming-accent font-medium transition-all duration-300 flex items-center justify-center gap-2">
        View All {activeTab === 'reports' ? 'Reports' : 'Reviews'}
        <ArrowRight size={18} />
      </button>
    </div>
  )
}
