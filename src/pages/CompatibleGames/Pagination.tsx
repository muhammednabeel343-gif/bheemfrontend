import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  // Show max 5 page buttons
  let pagesToShow = pages
  if (pages.length > 5) {
    const start = Math.max(0, currentPage - 3)
    const end = Math.min(pages.length, start + 5)
    pagesToShow = pages.slice(start, end)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gaming-accent/20 hover:border-gaming-accent/50 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-gaming-secondary hover:text-white transition-all duration-200"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {pagesToShow.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            page === currentPage
              ? 'bg-gaming-accent text-white shadow-glow'
              : 'bg-gaming-card text-gaming-secondary hover:text-gaming-accent hover:bg-gaming-surface border border-gaming-accent/20'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gaming-accent/20 hover:border-gaming-accent/50 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-gaming-secondary hover:text-white transition-all duration-200"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
