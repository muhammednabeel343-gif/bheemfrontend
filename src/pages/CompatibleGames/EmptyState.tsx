import { Search, Filter } from 'lucide-react'

interface Props {
  search: string
  filtersActive: boolean
}

export default function EmptyState({ search, filtersActive }: Props) {
  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
      {search ? (
        <>
          <Search size={48} className="mx-auto mb-4 text-gaming-secondary opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
          <p className="text-gaming-secondary mb-4">
            No games match your search term "{search}"
          </p>
          <p className="text-sm text-gaming-secondary">
            Try a different search or browse all games below.
          </p>
        </>
      ) : filtersActive ? (
        <>
          <Filter size={48} className="mx-auto mb-4 text-gaming-secondary opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No games match your filters</h3>
          <p className="text-gaming-secondary">
            Try adjusting your filter settings or clearing all filters.
          </p>
        </>
      ) : (
        <>
          <Search size={48} className="mx-auto mb-4 text-gaming-secondary opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No games available</h3>
          <p className="text-gaming-secondary">
            There are no games to display at the moment.
          </p>
        </>
      )}
    </div>
  )
}
