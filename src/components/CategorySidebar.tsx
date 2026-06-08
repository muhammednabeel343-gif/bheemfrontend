interface Props {
  categories: string[]
  value: string
  onSelect: (category: string) => void
}

function CategorySidebar({ categories, value, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6 hover:border-gaming-accent/40 transition-all duration-300">
      <h2 className="mb-6 text-lg font-bold text-white">Categories</h2>
      <div className="space-y-2">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category === 'All' ? '' : category)}
            className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all duration-300 ${
              value === category || (category === 'All' && value === '')
                ? 'bg-gaming-accent text-white shadow-glow'
                : 'bg-gaming-surface text-gaming-secondary hover:text-gaming-accent hover:bg-gaming-accent/10 border border-gaming-accent/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategorySidebar
