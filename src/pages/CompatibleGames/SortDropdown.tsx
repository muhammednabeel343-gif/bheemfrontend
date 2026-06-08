import { ChevronDown, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'

type SortOption = 'compatibility-desc' | 'compatibility-asc' | 'name-asc' | 'name-desc' | 'recent' | 'popular'

interface Props {
  value: SortOption
  onChange: (value: SortOption) => void
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'compatibility-desc', label: 'Best Compatibility' },
  { value: 'compatibility-asc', label: 'Worst Compatibility' },
  { value: 'name-asc', label: 'Name (A - Z)' },
  { value: 'name-desc', label: 'Name (Z - A)' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'popular', label: 'Most Popular' },
]

export default function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const selectedOption = sortOptions.find((opt) => opt.value === value)

  return (
    <div className="relative w-full sm:w-64">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full rounded-lg border-2 bg-gaming-surface px-4 py-2.5 text-sm font-medium transition-all duration-300 flex items-center justify-between gap-2 ${
          open
            ? 'border-gaming-accent/50'
            : 'border-gaming-accent/20 hover:border-gaming-accent/30'
        } text-white`}
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} />
          <span className="truncate">{selectedOption?.label || 'Sort'}</span>
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 flex-shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-full rounded-lg border border-gaming-accent/30 bg-gaming-card shadow-xl z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value
                  ? 'bg-gaming-accent/20 text-gaming-accent font-medium'
                  : 'text-gaming-secondary hover:bg-gaming-surface'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
