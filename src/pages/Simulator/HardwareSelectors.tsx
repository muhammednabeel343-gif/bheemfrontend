import { useState, useEffect } from 'react'
import type { SystemScan, GameSummary } from '../../types/game'

interface SimulationState {
  cpu: string
  gpu: string
  ram_gb: number
  storage_gb: number
  selectedGame: GameSummary | null
}

interface Props {
  simulation: SimulationState
  onSimulationChange: (state: SimulationState) => void
  games: GameSummary[]
  userSystem: SystemScan | null
}

interface HardwareOption {
  id: number
  name: string
  benchmark_score: number
}

export default function HardwareSelectors({
  simulation,
  onSimulationChange,
  games,
  userSystem,
}: Props) {
  const [cpuOptions, setCpuOptions] = useState<HardwareOption[]>([])
  const [gpuOptions, setGpuOptions] = useState<HardwareOption[]>([])
  const [cpuLoading, setCpuLoading] = useState(false)
  const [gpuLoading, setGpuLoading] = useState(false)

  // Load hardware options
  useEffect(() => {
    const loadHardware = async () => {
      try {
        // TODO: Replace with actual API calls
        // For now, mock data
        setCpuOptions([
          { id: 1, name: 'Intel Core i9-14900KS', benchmark_score: 4200 },
          { id: 2, name: 'Intel Core i9-13900K', benchmark_score: 4000 },
          { id: 3, name: 'AMD Ryzen 9 7950X3D', benchmark_score: 3950 },
          { id: 4, name: 'AMD Ryzen 7 5700X3D', benchmark_score: 3200 },
          { id: 5, name: 'Intel Core i7-13700K', benchmark_score: 3800 },
          { id: 6, name: 'AMD Ryzen 5 5600X', benchmark_score: 2400 },
        ])

        setGpuOptions([
          { id: 1, name: 'NVIDIA RTX 4090', benchmark_score: 18500 },
          { id: 2, name: 'NVIDIA RTX 4080', benchmark_score: 14500 },
          { id: 3, name: 'NVIDIA RTX 4070 Ti', benchmark_score: 11500 },
          { id: 4, name: 'NVIDIA RTX 4070', benchmark_score: 9500 },
          { id: 5, name: 'NVIDIA RTX 3080 Ti', benchmark_score: 9000 },
          { id: 6, name: 'NVIDIA RTX 3060', benchmark_score: 5800 },
        ])
      } catch (err) {
        console.error('Failed to load hardware options:', err)
      }
    }

    loadHardware()
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Hardware Configuration</h2>

      {/* CPU Selector */}
      <div>
        <label className="block text-sm font-medium text-gaming-secondary mb-2">
          Processor
        </label>
        <select
          value={simulation.cpu}
          onChange={(e) =>
            onSimulationChange({ ...simulation, cpu: e.target.value })
          }
          className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface px-4 py-2 text-sm text-white focus:border-gaming-accent/50 focus:outline-none transition-all duration-300"
        >
          <option value="">Select a CPU...</option>
          {cpuOptions.map((cpu) => (
            <option key={cpu.id} value={cpu.name}>
              {cpu.name} ({cpu.benchmark_score})
              {userSystem?.cpu === cpu.name && ' (Current)'}
            </option>
          ))}
        </select>
      </div>

      {/* GPU Selector */}
      <div>
        <label className="block text-sm font-medium text-gaming-secondary mb-2">
          Graphics Card
        </label>
        <select
          value={simulation.gpu}
          onChange={(e) =>
            onSimulationChange({ ...simulation, gpu: e.target.value })
          }
          className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface px-4 py-2 text-sm text-white focus:border-gaming-accent/50 focus:outline-none transition-all duration-300"
        >
          <option value="">Select a GPU...</option>
          {gpuOptions.map((gpu) => (
            <option key={gpu.id} value={gpu.name}>
              {gpu.name} ({gpu.benchmark_score})
              {userSystem?.gpu === gpu.name && ' (Current)'}
            </option>
          ))}
        </select>
      </div>

      {/* RAM Input */}
      <div>
        <label className="block text-sm font-medium text-gaming-secondary mb-2">
          RAM: {simulation.ram_gb} GB
        </label>
        <input
          type="range"
          min="1"
          max="256"
          value={simulation.ram_gb}
          onChange={(e) =>
            onSimulationChange({
              ...simulation,
              ram_gb: parseInt(e.target.value),
            })
          }
          className="w-full accent-gaming-accent"
        />
        <div className="flex justify-between text-xs text-gaming-secondary mt-1">
          <span>1 GB</span>
          <span>256 GB</span>
        </div>
      </div>

      {/* Storage Input */}
      <div>
        <label className="block text-sm font-medium text-gaming-secondary mb-2">
          Storage: {simulation.storage_gb} GB
        </label>
        <input
          type="range"
          min="10"
          max="10000"
          value={simulation.storage_gb}
          onChange={(e) =>
            onSimulationChange({
              ...simulation,
              storage_gb: parseInt(e.target.value),
            })
          }
          className="w-full accent-gaming-accent"
        />
        <div className="flex justify-between text-xs text-gaming-secondary mt-1">
          <span>10 GB</span>
          <span>10 TB</span>
        </div>
      </div>

      {/* Game Selector */}
      <div>
        <label className="block text-sm font-medium text-gaming-secondary mb-2">
          Select Game
        </label>
        <select
          value={simulation.selectedGame?.id || ''}
          onChange={(e) => {
            const game = games.find((g) => g.id === parseInt(e.target.value))
            onSimulationChange({
              ...simulation,
              selectedGame: game || null,
            })
          }}
          className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface px-4 py-2 text-sm text-white focus:border-gaming-accent/50 focus:outline-none transition-all duration-300"
        >
          <option value="">Choose a game...</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
