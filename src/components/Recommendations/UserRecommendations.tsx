import React from 'react'
import useRecommendations from '../../hooks/useRecommendations'

export default function UserRecommendations() {
  const { loading, recommendations } = useRecommendations(6)

  if (loading) return <div>Loading recommendations…</div>
  if (!recommendations || recommendations.length === 0) return <div>No recommendations yet.</div>

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold">Recommended for you</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {recommendations.map((r: any) => (
          <div key={r.game_id} className="rounded-md border p-4 bg-white/5">
            <div className="text-sm font-medium">{r.name}</div>
            <div className="text-xs text-gaming-secondary">Compatibility: {Math.round(r.compatibility)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
