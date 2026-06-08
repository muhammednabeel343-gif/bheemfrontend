import { TrendingUp, Zap } from 'lucide-react'

interface SimulationState {
  cpu: string
  gpu: string
  ram_gb: number
  storage_gb: number
  selectedGame: any
}

interface SimulationResult {
  compatibility_score: number
  status: string
  fps: any
  componentAnalysis: any
  bottlenecks: {
    primary: { component: string; impact: number }
    secondary?: { component: string; impact: number }
  }
}

interface Props {
  result: SimulationResult
  currentSystem: SimulationState
}

export default function UpgradeSuggestions({
  result,
  currentSystem,
}: Props) {
  const upgradePaths = [
    {
      priority: 1,
      name: 'GPU Upgrade (Biggest Impact)',
      components: ['GPU'],
      from: currentSystem.gpu,
      to: 'NVIDIA RTX 4080',
      cost: '$700-800',
      improvement: {
        compatibility: `${result.compatibility_score}% → 92%`,
        fps: '+35%',
      },
    },
    {
      priority: 2,
      name: 'Balanced Upgrade (Best Value)',
      components: ['GPU', 'CPU'],
      from: `${currentSystem.gpu} + ${currentSystem.cpu}`,
      to: 'RTX 4070 Ti + Ryzen 7 5700X3D',
      cost: '$800-1000',
      improvement: {
        compatibility: `${result.compatibility_score}% → 96%`,
        fps: '+55%',
      },
    },
    {
      priority: 3,
      name: 'Budget Upgrade',
      components: ['GPU'],
      from: currentSystem.gpu,
      to: 'NVIDIA RTX 3080 Ti',
      cost: '$300-400',
      improvement: {
        compatibility: `${result.compatibility_score}% → 85%`,
        fps: '+15%',
      },
    },
  ]

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={24} className="text-gaming-accent" />
        <h2 className="text-xl font-bold text-white">Upgrade Suggestions</h2>
      </div>

      <div className="space-y-4">
        {upgradePaths.map((path) => (
          <div
            key={path.priority}
            className="rounded-lg border border-gaming-accent/20 bg-gaming-surface/50 p-5 hover:border-gaming-accent/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gaming-secondary mb-1">
                  Option {path.priority}
                </p>
                <h3 className="text-lg font-bold text-white">{path.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-gaming-secondary mb-1">Est. Cost</p>
                <p className="text-sm font-bold text-gaming-accent">{path.cost}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div>
                <p className="text-gaming-secondary mb-1">From:</p>
                <p className="text-white font-medium line-clamp-1">
                  {path.from}
                </p>
              </div>
              <div>
                <p className="text-gaming-secondary mb-1">To:</p>
                <p className="text-white font-medium line-clamp-1">
                  {path.to}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/30">
              <div>
                <p className="text-xs text-gaming-secondary mb-1">
                  Compatibility
                </p>
                <p className="text-sm font-bold text-gaming-accent">
                  {path.improvement.compatibility}
                </p>
              </div>
              <div>
                <p className="text-xs text-gaming-secondary mb-1">FPS Gain</p>
                <p className="text-sm font-bold text-green-400">
                  {path.improvement.fps}
                </p>
              </div>
            </div>

            <button className="w-full mt-3 px-3 py-2 rounded-lg bg-gaming-accent/20 hover:bg-gaming-accent/30 text-gaming-accent text-sm font-medium transition-all duration-200">
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10">
        <p className="text-xs text-gaming-secondary">
          🎯 <strong>Note:</strong> These are estimated upgrades based on typical market prices and
          performance gains. Actual improvements may vary.
        </p>
      </div>
    </div>
  )
}
