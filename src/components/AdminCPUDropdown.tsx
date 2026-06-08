import { useEffect, useState } from 'react'

interface CPUOption {
  name: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  token: string
}

export default function AdminCPUDropdown({ value, onChange, token }: Props) {
  const [options, setOptions] = useState<CPUOption[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    
    fetch(`${import.meta.env.VITE_API_BASE_URL}/system/hardware/cpus`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOptions(Array.isArray(data) ? data : []))
      .catch(() => setOptions([]))
  }, [open, token])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-left text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none"
      >
        {value || 'Select CPU...'}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-purple-500/20 bg-[#0F172A] shadow-xl max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => {
                onChange(opt.name)
                setOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                value === opt.name
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-slate-300 hover:bg-purple-500/10'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
