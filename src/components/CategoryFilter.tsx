import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  value: string
  onSelect: (category: string) => void
}

function CategoryFilter({ categories, value, onSelect }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLabel = value ? categories.find(cat => cat === value) || 'All Categories' : 'All Categories'

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${ 
          isOpen
            ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
            : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gaming-accent" />
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-300 text-gaming-accent ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full min-w-max z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => {
              onSelect('')
              setIsOpen(false)
            }}
            className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
              value === ''
                ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent'
                : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${value === '' ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelect(category)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                value === category
                  ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent'
                  : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${value === category ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
