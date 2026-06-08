import { useEffect, useState } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import type { CompatibilityReport } from '../../types/game'
import Button from '../../components/Button/Button'

interface Props {
  gameId: number
  gameName: string
  gameImage?: string | null
  gameGenre?: string
  onClose: () => void
  token: string
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'excellent':
      return { bg: 'bg-status-excellent/10', border: 'border-status-excellent/30', text: 'text-status-excellent', badge: 'bg-status-excellent/20' }
    case 'playable':
      return { bg: 'bg-status-playable/10', border: 'border-status-playable/30', text: 'text-status-playable', badge: 'bg-status-playable/20' }
    case 'limited':
      return { bg: 'bg-status-limited/10', border: 'border-status-limited/30', text: 'text-status-limited', badge: 'bg-status-limited/20' }
    default:
      return { bg: 'bg-status-not-recommended/10', border: 'border-status-not-recommended/30', text: 'text-status-not-recommended', badge: 'bg-status-not-recommended/20' }
  }
}

const getCheckIcon = (passed: boolean) => {
  return passed ? (
    <Check size={20} className="text-status-excellent" />
  ) : (
    <AlertCircle size={20} className="text-status-not-recommended" />
  )
}

export default function GameCompatibilityModal({
  gameId,
  gameName,
  gameImage,
  gameGenre,
  onClose,
  token,
}: Props) {
  const [report, setReport] = useState<CompatibilityReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/games/${gameId}/compatibility`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load compatibility report')
        }

        const data = await response.json()
        setReport(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [gameId, token])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="rounded-2xl border border-gaming-accent/30 bg-gaming-card p-8 max-w-md w-full mx-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent mb-4"></div>
          <p className="text-gaming-secondary">Loading compatibility report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="rounded-2xl border border-gaming-accent/30 bg-gaming-card p-8 max-w-md w-full mx-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white">Error</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gaming-surface rounded-lg transition-colors"
            >
              <X size={20} className="text-gaming-secondary" />
            </button>
          </div>
          <p className="text-gaming-secondary mb-6">{error || 'Failed to load report'}</p>
          <Button onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    )
  }

  const statusColors = getStatusColor(report.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="rounded-2xl border border-gaming-accent/30 bg-gaming-card w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="relative h-48 overflow-hidden bg-gaming-surface">
          <img
            src={
              gameImage?.startsWith('http')
                ? gameImage
                : gameImage?.startsWith('/uploads/')
                  ? `${import.meta.env.VITE_API_BASE_URL || window.location.origin}${gameImage}`
                  : 'https://via.placeholder.com/800x400?text=Game'
            }
            alt={gameName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-card via-gaming-card/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Game Title and Genre */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{gameName}</h2>
            <p className="text-gaming-secondary">{gameGenre || 'Unknown Genre'}</p>
          </div>

          {/* Compatibility Score */}
          <div className={`rounded-xl border p-6 ${statusColors.bg} ${statusColors.border}`}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gaming-secondary text-sm mb-2">Compatibility</p>
                <p className={`text-4xl font-bold ${statusColors.text}`}>{report.compatibility_percentage}%</p>
              </div>
              <div>
                <p className="text-gaming-secondary text-sm mb-2">Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${statusColors.badge} ${statusColors.text}`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Estimates */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Estimated Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(report.estimated_fps).map(([setting, fps]) => (
                <div
                  key={setting}
                  className="rounded-lg border border-gaming-accent/20 bg-gaming-surface/50 p-4 text-center hover:border-gaming-accent/40 transition-colors"
                >
                  <p className="text-gaming-secondary text-sm capitalize mb-2">{setting}</p>
                  <p className="text-2xl font-bold text-gaming-accent">{fps} FPS</p>
                </div>
              ))}
            </div>
          </div>

          {/* Component Checks */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Component Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gaming-accent/20 bg-gaming-surface/50">
                <span className="text-white font-medium">CPU</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gaming-secondary">{report.user_specs.cpu}</span>
                  {getCheckIcon(report.checks.cpu_pass)}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gaming-accent/20 bg-gaming-surface/50">
                <span className="text-white font-medium">GPU</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gaming-secondary">{report.user_specs.gpu}</span>
                  {getCheckIcon(report.checks.gpu_pass)}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gaming-accent/20 bg-gaming-surface/50">
                <span className="text-white font-medium">RAM</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gaming-secondary">{report.user_specs.ram_gb} GB</span>
                  {getCheckIcon(report.checks.ram_pass)}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gaming-accent/20 bg-gaming-surface/50">
                <span className="text-white font-medium">Storage</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gaming-secondary">{report.user_specs.storage_gb} GB</span>
                  {getCheckIcon(report.checks.storage_pass)}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gaming-accent/20 bg-gaming-surface/50">
                <span className="text-white font-medium">OS</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gaming-secondary">{report.user_specs.operating_system}</span>
                  <Check size={20} className="text-status-excellent" />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements vs Your System */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-lg border border-gaming-accent/20 bg-gaming-surface/50 p-6">
              <h4 className="font-bold text-white mb-4">Minimum Requirements</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gaming-secondary">
                  <span className="text-white">CPU:</span> {report.minimum_requirements.cpu}
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">GPU:</span> {report.minimum_requirements.gpu}
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">RAM:</span> {report.minimum_requirements.ram_gb} GB
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">Storage:</span> {report.minimum_requirements.storage_gb} GB
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">OS:</span> {report.minimum_requirements.operating_system}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-gaming-accent/20 bg-gaming-surface/50 p-6">
              <h4 className="font-bold text-white mb-4">Your System</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gaming-secondary">
                  <span className="text-white">CPU:</span> {report.user_specs.cpu}
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">GPU:</span> {report.user_specs.gpu}
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">RAM:</span> {report.user_specs.ram_gb} GB
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">Storage:</span> {report.user_specs.storage_gb} GB
                </p>
                <p className="text-gaming-secondary">
                  <span className="text-white">OS:</span> {report.user_specs.operating_system}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} fullWidth size="lg">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
