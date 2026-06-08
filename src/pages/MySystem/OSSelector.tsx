import { useEffect, useState } from 'react'
import { getOsOptions } from '../../services/systemService'
import { ChevronDown, Monitor } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  token: string
  error?: string
}

interface OsOption {
  id: number
  name: string
}

export default function OSSelector({ value, onChange, token, error }: Props) {
  const [options, setOptions] = useState<OsOption[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadOses = async () => {
      if (!token) return
      try {
        setLoading(true)
        const data = await getOsOptions(token)
        setOptions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load operating systems:', err)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadOses()
    }
  }, [open, token])

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOption = options.find((opt) => opt.name === value)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-white mb-2">
        <div className="flex items-center gap-2">
          <Monitor size={16} className="text-orange-400" />
          Operating System
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
          {selectedOption ? selectedOption.name : 'Select an operating system...'}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-lg border border-gaming-accent/30 bg-gaming-card shadow-xl">
          <input
            type="text"
            placeholder="Search operating systems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-t-lg border-b border-gaming-accent/20 bg-gaming-surface px-4 py-2 text-white placeholder-gaming-secondary focus:outline-none"
          />

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-center text-gaming-secondary text-sm">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-3 text-center text-gaming-secondary text-sm">
                No operating systems found
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.name)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors duration-200 ${
                    value === option.name
                      ? 'bg-gaming-accent/20 text-gaming-accent'
                      : 'text-gaming-secondary hover:bg-gaming-surface'
                  }`}
                >
                  <div className="font-medium">{option.name}</div>
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
