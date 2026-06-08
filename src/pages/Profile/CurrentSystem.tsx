import { Zap, Cpu, HardDrive, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSystemScan } from '../../services/systemService'

interface SystemData {
  cpu: string
  gpu: string
  ram_gb: number
  storage_gb: number
  operating_system: string
}

interface Props {
  isOwnProfile: boolean
}

export default function CurrentSystem({ isOwnProfile }: Props) {
  const { token } = useAuth()
  const [system, setSystem] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOwnProfile || !token) {
      setLoading(false)
      return
    }

    const loadSystem = async () => {
      try {
        const systemData = await getSystemScan(token)
        setSystem(systemData)
      } catch (err) {
        console.error('Failed to load system:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSystem()
  }, [isOwnProfile, token])

  if (!system || loading) {
    return (
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-white">My PC</h2>
        <p className="text-gaming-secondary mt-4">No system information available</p>
      </div>
    )
  }

  const specs = [
    { label: 'CPU', value: system.cpu, icon: Zap },
    { label: 'GPU', value: system.gpu, icon: Monitor },
    { label: 'RAM', value: `${system.ram_gb} GB`, icon: Cpu },
    { label: 'Storage', value: `${system.storage_gb} GB`, icon: HardDrive },
  ]

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">My PC</h2>
      </div>

      {/* OS Info */}
      <div className="mb-6 pb-6 border-b border-gaming-accent/10">
        <p className="text-sm text-gaming-secondary mb-1">Operating System</p>
        <p className="text-white font-medium">{system.operating_system}</p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div
              key={spec.label}
              className="rounded-lg bg-gaming-surface/50 p-4 border border-gaming-accent/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-gaming-accent" />
                <p className="text-xs text-gaming-secondary">{spec.label}</p>
              </div>
              <p className="text-sm font-bold text-white line-clamp-2">
                {spec.value}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
