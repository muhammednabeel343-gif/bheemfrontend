import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getFavorites } from '../../services/favoriteService'

interface Favorite {
  id: number
  name: string
  image_url?: string
}

export default function FavoriteGames() {
  const { token } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)

  useEffect(() => {
    const loadFavorites = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await getFavorites(token)
        const games = response.favorites?.map((fav: any) => ({
          id: fav.game_id || fav.id,
          name: fav.game_name || fav.name,
          image_url: fav.game_image || fav.image_url,
        })) || []
        setFavorites(games)
      } catch (err) {
        console.error('Failed to load favorites:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [token])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    setScrollPos(container.scrollLeft)
    setScrollWidth(container.scrollWidth - container.clientWidth)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      })
    }
  }

  const scrollThumbWidth = scrollWidth > 0 ? (scrollRef.current?.clientWidth || 0) / (scrollWidth + (scrollRef.current?.clientWidth || 0)) * 100 : 100
  const scrollThumbPos = scrollWidth > 0 ? (scrollPos / scrollWidth) * (100 - scrollThumbWidth) : 0

  if (loading) {
    return (
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Favorite Games</h2>
        <p className="text-gaming-secondary">Loading favorites...</p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Favorite Games</h2>
        <div className="text-center py-8">
          <Heart size={48} className="text-gaming-secondary/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Favorites Yet</h3>
          <p className="text-gaming-secondary mb-6">
            Browse games to add your favorites!
          </p>
          <Link
            to="/compatible-games"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 text-white font-medium transition-all duration-300"
          >
            Browse Games
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
      <h2 className="text-xl font-bold text-white mb-6">Favorite Games</h2>

      <div ref={scrollRef} className="flex gap-4 overflow-x-scroll pb-6 scroll-smooth scrollbar-hide" onScroll={handleScroll}>
        {favorites.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            className="group relative overflow-hidden rounded-lg aspect-[2/3] bg-gaming-surface border border-gaming-accent/10 hover:border-gaming-accent/50 transition-all duration-300 flex-shrink-0 w-48 md:w-56"
          >
            <img
              src={game.image_url || 'https://via.placeholder.com/300x400?text=Game'}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Game'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
              <p className="text-sm font-bold text-white line-clamp-2">{game.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Custom Scrollbar */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => scroll('left')}
          className="p-2 rounded-full bg-gaming-accent hover:bg-gaming-accent/80 text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 bg-gaming-surface rounded-full h-2 relative">
          <div
            className="bg-gaming-accent rounded-full h-2 transition-all"
            style={{
              width: `${scrollThumbWidth}%`,
              marginLeft: `${scrollThumbPos}%`,
            }}
          />
        </div>

        <button
          onClick={() => scroll('right')}
          className="p-2 rounded-full bg-gaming-accent hover:bg-gaming-accent/80 text-white transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
