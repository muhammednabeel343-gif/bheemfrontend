import { Filter, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  genres: string[]
  filters: {
    compatibility: string | null
    genres: string[]
    priceRange: string | null
  }
  onFiltersChange: (filters: any) => void
}

const compatibilityLevels = [
  { value: 'excellent', label: 'Excellent (90%+)', color: 'text-green-400' },
  { value: 'playable', label: 'Playable (70-89%)', color: 'text-amber-400' },
  { value: 'limited', label: 'Limited (50-69%)', color: 'text-orange-400' },
  { value: 'not-recommended', label: 'Not Recommended (<50%)', color: 'text-red-400' },
]

const priceRanges = [
  { value: 'free', label: 'Free' },
  { value: '0-20', label: '$0 - $20' },
  { value: '20-50', label: '$20 - $50' },
  { value: '50+', label: '$50+' },
]

export default function FilterSidebar({ genres, filters, onFiltersChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre]
    onFiltersChange({ ...filters, genres: newGenres })
  }

  const handleCompatibilityChange = (value: string | null) => {
    onFiltersChange({
      ...filters,
      compatibility: filters.compatibility === value ? null : value,
    })
  }

  const handlePriceChange = (value: string | null) => {
    onFiltersChange({
      ...filters,
      priceRange: filters.priceRange === value ? null : value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      compatibility: null,
      genres: [],
      priceRange: null,
    })
  }

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.compatibility !== null ||
    filters.priceRange !== null

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Compatibility Filter */}
      <div>
        <h3 className="mb-3 font-bold text-white text-sm">Compatibility</h3>
        <div className="space-y-2">
          {compatibilityLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handleCompatibilityChange(level.value)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                filters.compatibility === level.value
                  ? 'bg-gaming-accent/20 text-gaming-accent border border-gaming-accent/50'
                  : 'text-gaming-secondary hover:bg-gaming-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    filters.compatibility === level.value ? 'bg-gaming-accent' : 'border border-gaming-secondary'
                  }`}
                ></div>
                <span className="text-sm">{level.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      <div>
        <h3 className="mb-3 font-bold text-white text-sm">Genre</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                filters.genres.includes(genre)
                  ? 'bg-gaming-accent/20 text-gaming-accent border border-gaming-accent/50'
                  : 'text-gaming-secondary hover:bg-gaming-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    filters.genres.includes(genre) ? 'bg-gaming-accent' : 'border border-gaming-secondary'
                  }`}
                ></div>
                <span className="text-sm truncate">{genre}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="mb-3 font-bold text-white text-sm">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handlePriceChange(range.value)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                filters.priceRange === range.value
                  ? 'bg-gaming-accent/20 text-gaming-accent border border-gaming-accent/50'
                  : 'text-gaming-secondary hover:bg-gaming-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    filters.priceRange === range.value ? 'bg-gaming-accent' : 'border border-gaming-secondary'
                  }`}
                ></div>
                <span className="text-sm">{range.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 rounded-lg bg-gaming-surface hover:bg-gaming-surface/80 text-gaming-secondary hover:text-white transition-all duration-200 text-sm font-medium"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="mb-6 xl:hidden flex items-center gap-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 rounded-lg border border-gaming-accent/20 hover:border-gaming-accent/50 px-4 py-2 text-sm font-medium text-white transition-all duration-300"
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-gaming-accent text-white">
              {filters.genres.length + (filters.compatibility ? 1 : 0) + (filters.priceRange ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 rounded-t-2xl border border-gaming-accent/20 bg-gaming-card p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-gaming-surface rounded-lg transition-colors"
              >
                <X size={20} className="text-gaming-secondary" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden xl:block rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6 h-fit sticky top-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter size={18} />
            Filters
          </h2>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-gaming-accent text-white">
              {filters.genres.length + (filters.compatibility ? 1 : 0) + (filters.priceRange ? 1 : 0)}
            </span>
          )}
        </div>
        <FilterContent />
      </div>
    </>
  )
}
