import { useEffect, useState } from 'react'

interface RAMOption {
  size: number
  label: string
}

interface Props {
  value: number | string
  onChange: (value: number) => void
}

export default function AdminRAMDropdown({ value, onChange }: Props) {
  const [options, setOptions] = useState<RAMOption[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    
    fetch(`${import.meta.env.VITE_API_BASE_URL}/system/hardware/rams`)
      .then((res) => res.json())
      .then((data) => setOptions(Array.isArray(data) ? data : []))
      .catch(() => setOptions([]))
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-left text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none"
      >
        {value ? `${value} GB` : 'Select RAM...'}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-purple-500/20 bg-[#0F172A] shadow-xl max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.size}
              type="button"
              onClick={() => {
                onChange(opt.size)
                setOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                value === opt.size
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-300 hover:bg-purple-500/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
