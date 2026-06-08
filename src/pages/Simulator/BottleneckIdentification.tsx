import { AlertTriangle, TrendingDown } from 'lucide-react'

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
}

export default function BottleneckIdentification({ result }: Props) {
  const { primary, secondary } = result.bottlenecks

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle size={24} className="text-amber-400" />
        <h2 className="text-xl font-bold text-white">Bottleneck Analysis</h2>
      </div>

      {/* Primary Bottleneck */}
      <div className="mb-6 rounded-lg border border-amber-400/30 bg-amber-400/10 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gaming-secondary mb-1">Primary Bottleneck</p>
            <p className="text-xl font-bold text-amber-400">{primary.component}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gaming-secondary">FPS Impact</p>
            <p className="text-2xl font-bold text-amber-400">-{primary.impact}%</p>
          </div>
        </div>

        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500"
            style={{ width: `${primary.impact}%` }}
          ></div>
        </div>
      </div>

      {/* Secondary Bottleneck */}
      {secondary && (
        <div className="rounded-lg border border-orange-400/30 bg-orange-400/10 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gaming-secondary mb-1">Secondary Bottleneck</p>
              <p className="text-lg font-bold text-orange-400">{secondary.component}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gaming-secondary">FPS Impact</p>
              <p className="text-xl font-bold text-orange-400">-{secondary.impact}%</p>
            </div>
          </div>

          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${secondary.impact}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="mt-6 p-4 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10">
        <p className="text-xs text-gaming-secondary">
          💡 <strong>Recommendation:</strong> Upgrading the{' '}
          <span className="text-amber-400 font-semibold">{primary.component}</span> would have the
          biggest impact on performance. This is your limiting factor.
        </p>
      </div>
    </div>
  )
}
