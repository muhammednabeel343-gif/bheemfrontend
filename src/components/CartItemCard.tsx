import { ShoppingCart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getGameDetails } from '../services/gameService'
import { useNavigate } from 'react-router-dom'
import type { CartItem } from '../services/cartService'

interface Props {
  item: CartItem
  onRemove: (gameId: number) => void
  isRemoving?: boolean
}

export default function CartItemCard({ item, onRemove, isRemoving }: Props) {
  const { token } = useAuth()
  const [genre, setGenre] = useState<string | undefined>((item as any).genre)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const fetchGenre = async () => {
      if (genre || !token) return
      try {
        const details = await getGameDetails(token, item.game_id)
        if (mounted && details?.genre) setGenre(details.genre)
      } catch (e) {
        // ignore
      }
    }
    void fetchGenre()
    return () => { mounted = false }
  }, [genre, token, item.game_id])
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm hover:border-gaming-accent/50 transition-all">
      {/* Game Image */}
      <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gaming-surface">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.game_name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Game Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white hover:text-gaming-accent transition-colors">
            {item.game_name}
          </h3>
          <p className="text-sm text-gaming-secondary mt-1">
            Added {new Date(item.created_at).toLocaleDateString()}
          </p>
          {genre && (
            <p className="text-sm text-gaming-secondary mt-1">
              {genre}
            </p>
          )}
        </div>

        </div>

        {/* Small price box (right) - show price amount and per-item checkout button */}
        <div className="w-44 flex-shrink-0 flex flex-col items-end justify-between">
          <div className="w-full p-3 rounded-lg border border-gaming-accent/20 bg-gaming-card/50 text-left">
            <div className="text-sm text-gaming-secondary">Price</div>
            <div className="text-lg font-bold text-gaming-accent">₹{item.price.toFixed(2)}</div>
          </div>

          <button
            onClick={() => navigate('/checkout', { state: { items: [item], totalAmount: item.price } })}
            className="mt-3 w-full px-3 py-2 rounded-lg bg-gaming-accent text-white font-semibold hover:bg-gaming-accent/90 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>

        {/* Remove Button */}
        <div className="flex items-center ml-4">
          <button
            onClick={() => onRemove(item.game_id)}
            disabled={isRemoving}
            className="p-2 rounded-lg bg-status-not-recommended/20 hover:bg-status-not-recommended/40 text-status-not-recommended transition-colors disabled:opacity-50"
            title="Remove from cart"
          >
            <Trash2 size={20} />
          </button>
        </div>
    </div>
  )
}
