import { useEffect, useState } from 'react'
import { getRamOptions } from '../../services/systemService'
import { ChevronDown, Monitor } from 'lucide-react'

interface Props {
  value: number | ''
  onChange: (value: number) => void
  error?: string
}

interface RamOption {
  size: number
  value: number
  label: string
}

export default function RAMDropdown({ value, onChange, error }: Props) {
  const [options, setOptions] = useState<RamOption[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadRams = async () => {
      try {
        setLoading(true)
        const data = await getRamOptions('')
        setOptions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load RAM options:', err)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadRams()
    }
  }, [open])

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOption = options.find((opt) => opt.size === value)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-white mb-2">
        <div className="flex items-center gap-2">
          <Monitor size={16} className="text-blue-400" />
          RAM Memory
        </div>
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full rounded-lg border-2 bg-gaming-surface px-4 py-3 text-left text-white transition-all duration-300 flex items-center justify-between ${
          error
            ? 'border-status-not-recommended/50'
            : open
              ? 'border-gaming-accent/50'
              : 'border-gaming-accent/20 hover:border-gaming-accent/30'
        }`}
      >
        <span className={selectedOption ? 'text-white' : 'text-gaming-secondary'}>
          {selectedOption ? selectedOption.label : 'Select RAM memory...'}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[999] rounded-lg border border-gaming-accent/30 bg-gaming-card shadow-xl">
          <input
            type="text"
            placeholder="Search RAM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-t-lg border-b border-gaming-accent/20 bg-gaming-surface px-4 py-2 text-white placeholder-gaming-secondary focus:outline-none"
          />

          <div className="overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-center text-gaming-secondary text-sm">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-3 text-center text-gaming-secondary text-sm">
                No RAM options found
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.size}
                  type="button"
                  onClick={() => {
                    onChange(option.size)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
                    value === option.size
                      ? 'bg-gaming-accent/20 text-gaming-accent font-medium'
                      : 'text-gaming-secondary hover:bg-gaming-surface'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-status-not-recommended">{error}</p>}
    </div>
  )
}
