interface Props {
  categories: string[]
  value: string
  onSelect: (category: string) => void
}

function CategorySidebar({ categories, value, onSelect }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Categories</h2>
      <div className="space-y-3">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category === 'All' ? '' : category)}
            className={`block w-full rounded-2xl px-4 py-3 text-left text-sm ${
              value === category || (category === 'All' && value === '')
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
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
