import { HardDrive, Zap, Cpu, Monitor } from 'lucide-react'
import type { SystemScan } from '../../types/game'

interface Props {
  system: SystemScan
}

export default function SystemDisplay({ system }: Props) {
  const hardwareSpecs = [
    {
      icon: Zap,
      label: 'Processor',
      value: system.cpu,
      color: 'text-yellow-400',
    },
    {
      icon: Cpu,
      label: 'Graphics Card',
      value: system.gpu,
      color: 'text-green-400',
    },
    {
      icon: Monitor,
      label: 'RAM',
      value: `${system.ram_gb} GB`,
      color: 'text-blue-400',
    },
    {
      icon: HardDrive,
      label: 'Storage',
      value: `${system.storage_gb} GB`,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hardware Configuration */}
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          Your Hardware Configuration
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {hardwareSpecs.map((spec) => {
            const Icon = spec.icon
            return (
              <div
                key={spec.label}
                className="rounded-lg border border-gaming-accent/20 bg-gaming-surface/50 p-6 transition-all duration-300 hover:border-gaming-accent/50 hover:shadow-glow"
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg bg-gaming-surface p-3 ${spec.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gaming-secondary">
                      {spec.label}
                    </p>
                    <p className="mt-2 text-xl font-bold text-white line-clamp-2">
                      {spec.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Operating System - Table Format */}
      {system.operating_system && (
        <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
          <h2 className="mb-6 text-xl font-bold text-white">
            Operating System
          </h2>
          <div className="overflow-hidden rounded-lg border border-gaming-accent/20">
            <table className="w-full">
              <thead className="bg-gaming-surface/50">
                <tr className="border-b border-gaming-accent/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gaming-secondary">
                    System
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gaming-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gaming-accent/10 hover:bg-gaming-surface/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Monitor size={20} className="text-orange-400" />
                      <span className="font-medium text-white">
                        {system.operating_system}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-gaming-accent/20 px-3 py-1 text-sm font-medium text-gaming-accent">
                      ✓ Selected
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
