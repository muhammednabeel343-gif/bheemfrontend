interface Props {
  value: number | ''
  onChange: (value: number) => void
  error?: string
}

export default function StorageInput({ value, onChange, error }: Props) {
  const numValue = typeof value === 'number' ? value : parseInt(value) || 500
  const displayValue = numValue >= 1000 ? `${(numValue / 1000).toFixed(1)} TB` : `${numValue} GB`

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-white">
          Storage Capacity
        </label>
        <span className="text-lg font-bold text-gaming-accent">{displayValue}</span>
      </div>
      <input
        type="range"
        min="10"
        max="10000"
        step="10"
        value={numValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-gaming-accent cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gaming-secondary mt-2">
        <span>10 GB</span>
        <span>10 TB</span>
      </div>
      {error && <p className="mt-2 text-sm text-status-not-recommended">{error}</p>}
    </div>
  )
}
