import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import type { SystemScan } from '../../types/game'

interface SimulationResult {
  compatibility_score: number
  status: string
  fps: any
  componentAnalysis: {
    cpu: { status: string; performance: number }
    gpu: { status: string; performance: number }
    ram: { status: string; performance: number }
    storage: { status: string; performance: number }
  }
  bottlenecks: any
}

interface Props {
  result: SimulationResult
  userSystem: SystemScan | null
}

export default function ComponentAnalysis({ result, userSystem }: Props) {
  const getStatusIcon = (status: string) => {
    if (status.includes('exceed') || status.includes('sufficient'))
      return <CheckCircle size={20} className="text-green-400" />
    if (status.includes('meet')) return <AlertCircle size={20} className="text-amber-400" />
    return <XCircle size={20} className="text-red-400" />
  }

  const getStatusLabel = (status: string) => {
    if (status.includes('exceed')) return 'Exceeds'
    if (status.includes('meet')) return 'Meets'
    return 'Below'
  }

  const components = [
    { key: 'cpu', label: 'Processor', icon: '⚙️' },
    { key: 'gpu', label: 'Graphics Card', icon: '🖥️' },
    { key: 'ram', label: 'Memory', icon: '💾' },
    { key: 'storage', label: 'Storage', icon: '🔌' },
  ]

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8">
      <h2 className="text-xl font-bold text-white mb-6">Component Analysis</h2>

      <div className="space-y-4">
        {components.map((comp) => {
          const analysis = result.componentAnalysis[comp.key as keyof typeof result.componentAnalysis]
          return (
            <div
              key={comp.key}
              className="rounded-lg border border-gaming-accent/10 bg-gaming-surface/50 p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{comp.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{comp.label}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(analysis.status)}
                    <span className="text-sm text-gaming-secondary">
                      {getStatusLabel(analysis.status)} Requirements
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        analysis.performance >= 80
                          ? 'bg-green-500'
                          : analysis.performance >= 60
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(analysis.performance, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-white w-12 text-right">
                  {analysis.performance}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
