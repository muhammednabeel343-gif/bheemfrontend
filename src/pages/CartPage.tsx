import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getCart, removeFromCart } from '../services/cartService'
import type { Cart } from '../services/cartService'
import CartItemCard from '../components/CartItemCard'
import { ShoppingCart } from 'lucide-react'

export default function CartPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState<number | null>(null)

  useEffect(() => {
    const loadCart = async () => {
      if (!token) return

      setLoading(true)
      setError('')

      try {
        const cartData = await getCart(token)
        setCart(cartData)
      } catch (err) {
        setError('Failed to load cart')
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [token])

  const handleRemove = async (gameId: number) => {
    if (!token || !cart) return

    setRemoving(gameId)
    try {
      await removeFromCart(token, gameId)
      setCart({
        ...cart,
        items: cart.items.filter(item => item.game_id !== gameId),
        count: cart.count - 1,
        total_amount: cart.total_amount - (cart.items.find(i => i.game_id === gameId)?.price || 0),
      })
    } catch (err) {
      setError('Failed to remove item from cart')
    } finally {
      setRemoving(null)
    }
  }

  const handleCheckout = () => {
    if (cart && cart.items.length > 0) {
      navigate('/checkout', {
        state: {
          items: cart.items,
          totalAmount: cart.total_amount,
        },
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart size={48} className="text-gaming-accent mx-auto mb-4 animate-pulse" />
          <p className="text-gaming-secondary">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gaming-secondary">
            {cart?.count || 0} {cart?.count === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-status-not-recommended/20 border border-status-not-recommended text-status-not-recommended">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="text-gaming-secondary/50 mx-auto mb-4" />
            <p className="text-xl text-gaming-secondary mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 rounded-lg bg-gaming-accent text-white font-bold hover:bg-gaming-accent/90 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.items.map(item => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  isRemoving={removing === item.game_id}
                />
              ))}

              {/* Full-width checkout button removed per design request */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
