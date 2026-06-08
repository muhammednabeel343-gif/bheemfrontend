import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react'

interface SimulationResult {
  compatibility_score: number
  status: 'excellent' | 'playable' | 'limited' | 'not-recommended'
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

export default function CompatibilityAnalysis({ result }: Props) {
  const statusConfig = {
    excellent: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
      icon: CheckCircle,
      label: 'Excellent',
    },
    playable: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/30',
      icon: CheckCircle,
      label: 'Playable',
    },
    limited: {
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/30',
      icon: AlertTriangle,
      label: 'Limited',
    },
    'not-recommended': {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/30',
      icon: XCircle,
      label: 'Not Recommended',
    },
  }

  const config = statusConfig[result.status]
  const Icon = config.icon

  return (
    <div className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-8`}>
      <h2 className="text-xl font-bold text-white mb-6">Compatibility Analysis</h2>

      <div className="flex flex-col items-center justify-center mb-6">
        <Icon size={48} className={config.color} />
        <p className={`text-5xl font-bold ${config.color} mt-4`}>
          {result.compatibility_score}%
        </p>
        <p className={`text-lg font-semibold ${config.color} mt-2`}>
          {config.label}
        </p>
      </div>

      <div className="bg-black/30 rounded-lg p-4">
        <p className="text-sm text-gaming-secondary text-center">
          {result.status === 'excellent' &&
            'Excellent performance expected. Smooth gaming at high settings.'}
          {result.status === 'playable' &&
            'Good performance. You can run this game with high or medium settings smoothly.'}
          {result.status === 'limited' &&
            'Limited support. The game will run, but lower settings recommended.'}
          {result.status === 'not-recommended' &&
            'Not recommended. Your system may struggle significantly with this game.'}
        </p>
      </div>
    </div>
  )
}
