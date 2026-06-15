import { CheckCircle, AlertCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react'
import type { CompatibilityReport, SystemScan } from '../../types/game'

interface Props {
  report: CompatibilityReport | null | undefined
  userSystem: SystemScan | null
}

export default function CompatibilityReportCard({
  report,
  userSystem,
}: Props) {
  if (!report) {
    return null
  }

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

  const statusKey = (report?.status || 'playable') as keyof typeof statusConfig
  const config = statusConfig[statusKey] || statusConfig['playable']
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

      {/* AI Insights Section */}
      {report.ai_insights && (
        <div className="mt-8 pt-8 border-t border-gaming-accent/20">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-violet-400" size={20} />
            <h3 className="text-lg font-bold text-white">AI Compatibility Insights</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* GPU Analysis */}
            {report.ai_insights.gpu_analysis && (
              <div className="bg-white/5 rounded-lg border border-gaming-accent/10 p-4">
                <p className="text-xs text-gaming-secondary font-semibold mb-2">GPU Analysis</p>
                <p className="text-sm text-white">{report.ai_insights.gpu_analysis}</p>
              </div>
            )}

            {/* CPU Analysis */}
            {report.ai_insights.cpu_analysis && (
              <div className="bg-white/5 rounded-lg border border-gaming-accent/10 p-4">
                <p className="text-xs text-gaming-secondary font-semibold mb-2">CPU Analysis</p>
                <p className="text-sm text-white">{report.ai_insights.cpu_analysis}</p>
              </div>
            )}

            {/* RAM Analysis */}
            {report.ai_insights.ram_analysis && (
              <div className="bg-white/5 rounded-lg border border-gaming-accent/10 p-4">
                <p className="text-xs text-gaming-secondary font-semibold mb-2">RAM Analysis</p>
                <p className="text-sm text-white">{report.ai_insights.ram_analysis}</p>
              </div>
            )}

            {/* Storage Analysis */}
            {report.ai_insights.storage_analysis && (
              <div className="bg-white/5 rounded-lg border border-gaming-accent/10 p-4">
                <p className="text-xs text-gaming-secondary font-semibold mb-2">Storage Analysis</p>
                <p className="text-sm text-white">{report.ai_insights.storage_analysis}</p>
              </div>
            )}

            {/* OS Analysis */}
            {report.ai_insights.os_analysis && (
              <div className="bg-white/5 rounded-lg border border-gaming-accent/10 p-4">
                <p className="text-xs text-gaming-secondary font-semibold mb-2">OS Analysis</p>
                <p className="text-sm text-white">{report.ai_insights.os_analysis}</p>
              </div>
            )}

            {/* Expected Experience */}
            {report.ai_insights.expected_experience && (
              <div className="bg-emerald-500/10 rounded-lg border border-emerald-500/30 p-4">
                <p className="text-xs text-emerald-400 font-semibold mb-2">Expected Experience</p>
                <p className="text-sm text-white">{report.ai_insights.expected_experience}</p>
              </div>
            )}
          </div>

          {/* Recommended Settings */}
          {report.ai_insights.recommended_settings && Array.isArray(report.ai_insights.recommended_settings) && report.ai_insights.recommended_settings.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Recommended Settings</h4>
              <div className="bg-white/5 rounded-lg border border-gaming-accent/10 p-4">
                <ul className="space-y-2">
                  {report.ai_insights.recommended_settings.map((setting, idx) => (
                    <li key={idx} className="text-sm text-gaming-secondary">
                      • {setting}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tips & Tricks */}
          {report.ai_insights.tips && Array.isArray(report.ai_insights.tips) && report.ai_insights.tips.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">💡 Tips & Tricks</h4>
              <div className="bg-amber-500/10 rounded-lg border border-amber-500/30 p-4">
                <ul className="space-y-2">
                  {report.ai_insights.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-amber-100">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Warnings */}
          {report.ai_insights.warnings && Array.isArray(report.ai_insights.warnings) && report.ai_insights.warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">⚠️ Warnings</h4>
              <div className="bg-rose-500/10 rounded-lg border border-rose-500/30 p-4">
                <ul className="space-y-2">
                  {report.ai_insights.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-rose-100">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
