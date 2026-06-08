import { Zap, Cpu, Monitor, HardDrive } from 'lucide-react'
import type { Requirement } from '../../types/game'

interface Props {
  requirement: Requirement
  type?: 'minimum' | 'recommended'
}

export default function RequirementCard({
  requirement,
  type = 'minimum',
}: Props) {
  const specs = [
    {
      icon: Zap,
      label: 'Processor',
      value: requirement.cpu,
      color: 'text-yellow-400',
    },
    {
      icon: Cpu,
      label: 'Graphics',
      value: requirement.gpu,
      color: 'text-green-400',
    },
    {
      icon: Monitor,
      label: 'RAM',
      value: `${requirement.ram} GB`,
      color: 'text-blue-400',
    },
    {
      icon: HardDrive,
      label: 'Storage',
      value: `${requirement.storage} GB`,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-block px-3 py-1 rounded-full bg-gaming-accent/10 text-gaming-accent text-xs font-semibold mb-3">
          {type === 'minimum' ? 'Minimum Requirements' : 'Recommended'}
        </div>

        {requirement.os && (
          <p className="text-sm text-gaming-secondary">
            {requirement.os}
          </p>
        )}
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div key={spec.label} className="p-4 rounded-lg bg-gaming-surface/50">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={spec.color} />
                <p className="text-xs text-gaming-secondary">{spec.label}</p>
              </div>
              <p className="text-sm font-bold text-white line-clamp-2">
                {spec.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* DirectX Info */}
      {requirement.directx && (
        <div className="mt-4 pt-4 border-t border-gaming-accent/10">
          <p className="text-xs text-gaming-secondary">
            DirectX {requirement.directx}
          </p>
        </div>
      )}
    </div>
  )
}
