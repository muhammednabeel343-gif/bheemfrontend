import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { CompatibilityReport, SystemScan } from '../../types/game'

interface Props {
  report: CompatibilityReport
  userSystem: SystemScan | null
}

export default function CompatibilityReportCard({
  report,
  userSystem,
}: Props) {
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

  const statusKey = (report.status || 'playable') as keyof typeof statusConfig
  const config = statusConfig[statusKey]
  const Icon = config.icon

  return (
    <div className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-8`}>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Compatibility Score */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Icon size={24} className={config.color} />
            <div>
              <p className="text-sm text-gaming-secondary">Compatibility Status</p>
              <p className={`text-2xl font-bold ${config.color}`}>
                {report.compatibility_percentage}%
              </p>
            </div>
          </div>

          <p className={`text-sm font-semibold mb-4 ${config.color}`}>
            {config.label}
          </p>

          {/* Requirements Check */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {report.checks.cpu_pass ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gaming-secondary">
                CPU: {report.minimum_requirements.cpu}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {report.checks.gpu_pass ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gaming-secondary">
                GPU: {report.minimum_requirements.gpu}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {report.checks.ram_pass ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gaming-secondary">
                RAM: {report.minimum_requirements.ram_gb}GB
              </span>
            </div>

            <div className="flex items-center gap-2">
              {report.checks.storage_pass ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gaming-secondary">
                Storage: {report.minimum_requirements.storage_gb}GB
              </span>
            </div>

            <div className="flex items-center gap-2">
              {report.checks.os_pass ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gaming-secondary">
                OS: {report.minimum_requirements.operating_system}
              </span>
            </div>
          </div>
        </div>

        {/* FPS Estimates */}
        <div>
          <p className="text-sm text-gaming-secondary mb-4">Estimated FPS</p>
          <div className="space-y-3">
            {[
              { label: 'Low', fps: report.estimated_fps.low },
              { label: 'Medium', fps: report.estimated_fps.medium },
              { label: 'High', fps: report.estimated_fps.high },
              { label: 'Ultra', fps: report.estimated_fps.ultra },
            ].map((setting) => (
              <div key={setting.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gaming-secondary">
                    {setting.label}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {setting.fps} FPS
                  </span>
                </div>
                <div className="w-full h-2 bg-gaming-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      setting.fps >= 60
                        ? 'bg-green-500'
                        : setting.fps >= 30
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min((setting.fps / 100) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* User System Comparison */}
          {userSystem && (
            <div className="mt-4 pt-4 border-t border-gaming-accent/10">
              <p className="text-xs text-gaming-secondary mb-2">Your System</p>
              <p className="text-xs text-white line-clamp-2">
                {userSystem.cpu}
              </p>
              <p className="text-xs text-white line-clamp-2">
                {userSystem.gpu}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
