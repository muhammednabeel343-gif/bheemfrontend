interface PresetConfig {
  name: string
  config: {
    cpu: string
    gpu: string
    ram_gb: number
    storage_gb: number
  }
}

interface Props {
  presets: PresetConfig[]
  onPresetSelect: (config: any) => void
}

export default function PresetConfigs({ presets, onPresetSelect }: Props) {
  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
      <h3 className="text-sm font-bold text-white mb-3">Quick Presets</h3>
      <div className="space-y-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onPresetSelect(preset.config)}
            className="w-full text-left px-3 py-2 rounded-lg bg-gaming-surface hover:bg-gaming-accent/20 text-sm text-white transition-all duration-200 border border-gaming-accent/10 hover:border-gaming-accent/50"
          >
            <div className="font-medium">{preset.name}</div>
            <div className="text-xs text-gaming-secondary mt-1">
              {preset.config.cpu.split(' ').slice(0, 2).join(' ')} • {preset.config.gpu.split(' ').slice(0, 2).join(' ')} • {preset.config.ram_gb}GB
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
