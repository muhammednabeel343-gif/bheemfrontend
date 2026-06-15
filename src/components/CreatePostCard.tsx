import { useState, useMemo } from 'react'
import { Send, Paperclip, X } from 'lucide-react'

interface Game {
  id: number
  name: string
  image_url?: string
}

interface Props {
  onPost: (content: string, gameId?: number) => Promise<void>
  isLoading?: boolean
  games?: Game[]
  onLoadGames?: (search: string) => Promise<void>
}

export default function CreatePostCard({ onPost, isLoading, games = [], onLoadGames }: Props) {
  const [content, setContent] = useState('')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showGameDropdown, setShowGameDropdown] = useState(false)
  const [gameSearch, setGameSearch] = useState('')
  const [posting, setPosting] = useState(false)

  const filteredGames = useMemo(() => {
    if (!gameSearch) return games
    return games.filter(g => g.name.toLowerCase().includes(gameSearch.toLowerCase()))
  }, [games, gameSearch])

  const handlePost = async () => {
    if (!content.trim()) return

    setPosting(true)
    try {
      await onPost(content, selectedGame?.id)
      setContent('')
      setSelectedGame(null)
      setGameSearch('')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="p-6 rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm shadow-lg mb-6">
      <h3 className="text-lg font-bold text-white mb-4">What's on your mind?</h3>

      {/* Content textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your gaming experience, tips, or reactions..."
        rows={4}
        className="w-full px-4 py-3 rounded-lg bg-gaming-surface border border-gaming-accent/20 text-white placeholder-gaming-secondary focus:outline-none focus:border-gaming-accent transition-colors resize-none"
      />

      {/* Selected game display */}
      {selectedGame && (
        <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-gaming-surface border border-gaming-accent/20">
          {selectedGame.image_url && (
            <img
              src={selectedGame.image_url}
              alt={selectedGame.name}
              className="w-12 h-16 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <p className="text-sm text-gaming-secondary">Attached Game</p>
            <p className="font-bold text-white">{selectedGame.name}</p>
          </div>
          <button
            onClick={() => setSelectedGame(null)}
            className="p-1 rounded hover:bg-gaming-accent/20 transition-colors"
          >
            <X size={18} className="text-gaming-secondary" />
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        {/* Game Attachment Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowGameDropdown(!showGameDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gaming-surface border border-gaming-accent/20 text-gaming-secondary hover:border-gaming-accent/50 hover:text-gaming-accent transition-all"
          >
            <Paperclip size={16} />
            Attach Game
          </button>

          {showGameDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-gaming-accent/20 bg-gaming-card shadow-lg z-10">
              <input
                type="text"
                placeholder="Search games..."
                value={gameSearch}
                onChange={(e) => {
                  setGameSearch(e.target.value)
                  onLoadGames?.(e.target.value)
                }}
                className="w-full px-3 py-2 bg-gaming-surface border-b border-gaming-accent/20 text-white placeholder-gaming-secondary focus:outline-none"
              />
              <div className="max-h-48 overflow-y-auto">
                {filteredGames.map(game => (
                  <button
                    key={game.id}
                    onClick={() => {
                      setSelectedGame(game)
                      setShowGameDropdown(false)
                      setGameSearch('')
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gaming-surface transition-colors text-left"
                  >
                    {game.image_url && (
                      <img src={game.image_url} alt={game.name} className="w-8 h-10 rounded object-cover" />
                    )}
                    <span className="text-white flex-1">{game.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Post Button */}
        <button
          onClick={handlePost}
          disabled={posting || isLoading || !content.trim()}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gaming-accent text-white font-bold hover:bg-gaming-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          <Send size={16} />
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
