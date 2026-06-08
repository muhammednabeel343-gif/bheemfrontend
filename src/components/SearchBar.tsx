import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value?: string
  onSearch: (query: string) => void
  placeholder?: string
}

function SearchBar({ value = '', onSearch, placeholder = 'Search games' }: SearchBarProps) {
  const [query, setQuery] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <label className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 backdrop-blur-sm transition-all duration-300 ${
      isFocused
        ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/20'
        : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50'
    }`}>
      <Search size={18} className={`transition-colors duration-300 ${
        isFocused ? 'text-gaming-accent' : 'text-gaming-secondary'
      }`} />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder-gaming-secondary/50 outline-none"
      />
    </label>
  )
}

export default SearchBar
