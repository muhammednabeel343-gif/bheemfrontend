import { useEffect, useState } from 'react'

interface SearchBarProps {
  value?: string
  onSearch: (query: string) => void
}

function SearchBar({ value = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <label className="flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-slate-500">Search</span>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search games"
        className="w-full bg-transparent text-sm text-slate-900 outline-none"
      />
    </label>
  )
}

export default SearchBar
