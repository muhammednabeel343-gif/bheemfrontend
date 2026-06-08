interface SimulationResult {
  compatibility_score: number
  status: string
  fps: {
    low: number
    medium: number
    high: number
    ultra: number
  }
  componentAnalysis: any
  bottlenecks: any
}

interface Props {
  result: SimulationResult
}

export default function PerformanceEstimate({ result }: Props) {
  const settings = [
    { label: '1080p Low', fps: result.fps.low },
    { label: '1080p Medium', fps: result.fps.medium },
    { label: '1080p High', fps: result.fps.high },
    { label: '1080p Ultra', fps: result.fps.ultra },
  ]

  const getFpsColor = (fps: number) => {
    if (fps >= 60) return 'text-green-400'
    if (fps >= 45) return 'text-amber-400'
    if (fps >= 30) return 'text-orange-400'
    return 'text-red-400'
  }

  const getFpsBarColor = (fps: number) => {
    if (fps >= 60) return 'bg-green-500'
    if (fps >= 45) return 'bg-amber-500'
    if (fps >= 30) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8">
      <h2 className="text-xl font-bold text-white mb-6">Expected Performance</h2>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gaming-secondary">
                {setting.label}
              </span>
              <span className={`text-lg font-bold ${getFpsColor(setting.fps)}`}>
                {setting.fps} FPS
              </span>
            </div>

            <div className="w-full h-3 bg-gaming-surface rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getFpsBarColor(setting.fps)}`}
                style={{
                  width: `${Math.min((setting.fps / 120) * 100, 100)}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between mt-1">
              <span className="text-xs text-gaming-secondary">
                {setting.fps >= 60
                  ? 'Excellent'
                  : setting.fps >= 45
                    ? 'Good'
                    : setting.fps >= 30
                      ? 'Playable'
                      : 'Struggles'}
              </span>
              <span className="text-xs text-gaming-secondary">30 FPS minimum</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10">
        <p className="text-xs text-gaming-secondary">
          💡 <strong>Recommended:</strong> Aim for 60+ FPS at your target resolution for smooth gameplay.
        </p>
      </div>
    </div>
  )
}
