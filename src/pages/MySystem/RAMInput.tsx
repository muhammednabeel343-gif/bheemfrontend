interface Props {
  value: number | ''
  onChange: (value: number) => void
  error?: string
}

export default function RAMInput({ value, onChange, error }: Props) {
  const numValue = typeof value === 'number' ? value : parseInt(value) || 16

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-white">
          RAM Memory
        </label>
        <span className="text-lg font-bold text-gaming-accent">{numValue} GB</span>
      </div>
      <input
        type="range"
        min="1"
        max="256"
        step="1"
        value={numValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-gaming-accent cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gaming-secondary mt-2">
        <span>1 GB</span>
        <span>256 GB</span>
      </div>
      {error && <p className="mt-2 text-sm text-status-not-recommended">{error}</p>}
    </div>
  )
}
