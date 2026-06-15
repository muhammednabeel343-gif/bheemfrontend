import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { createOrder, simulatePayment } from '../services/orderService'
import type { CartItem } from '../services/cartService'
import { CreditCard, Check, X } from 'lucide-react'

interface LocationState {
  items: CartItem[]
  totalAmount: number
}

export default function CheckoutPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)

  const items = state?.items || []
  const totalAmount = state?.totalAmount || 0

  useEffect(() => {
    if (!state) {
      navigate('/cart')
    }
  }, [state, navigate])

  const paymentMethods = [
    { id: 'upi', label: '💳 UPI', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'credit_card', label: '💳 Credit Card', description: 'Visa, Mastercard, Amex' },
    { id: 'debit_card', label: '🏦 Debit Card', description: 'All bank debit cards' },
    { id: 'net_banking', label: '🏛️ Net Banking', description: 'Direct bank transfer' },
  ]

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    if (!token) {
      setError('Please login to complete purchase')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create order
      const order = await createOrder(
        token,
        items.map(i => i.game_id),
        totalAmount,
        paymentMethod
      )
      setOrderCreated(true)

      // Simulate payment
      const paymentResult = await simulatePayment(token, order.id, true)

      if (paymentResult.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/profile')
        }, 3000)
      } else {
        setError('Payment processing failed. Please try again.')
      }
    } catch (err) {
      setError('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gaming-accent/20">
              <Check size={64} className="text-gaming-accent" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gaming-secondary text-lg">
              Your games have been added to your library.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gaming-card/50 border border-gaming-accent/20">
            <p className="text-gaming-secondary text-sm">Order Total</p>
            <p className="text-3xl font-bold text-gaming-accent">₹{totalAmount.toFixed(2)}</p>
          </div>

          <p className="text-gaming-secondary">
            Redirecting to your profile in 3 seconds...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gaming-secondary">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-status-not-recommended/20 border border-status-not-recommended text-status-not-recommended flex items-center gap-3">
                <X size={20} />
                {error}
              </div>
            )}

            {/* Selected Items */}
            <div className="p-6 rounded-lg border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Order Items ({items.length})</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-white">{item.game_name}</span>
                    <span className="font-bold text-gaming-accent">₹{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods Dropdown */}
            <div className="p-6 rounded-lg border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Select Payment Method
              </h3>

              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gaming-accent/20 bg-gaming-surface/50 text-white font-semibold appearance-none cursor-pointer hover:border-gaming-accent/50 focus:border-gaming-accent focus:outline-none focus:ring-2 focus:ring-gaming-accent/20 transition-all"
                >
                  <option value="">-- Choose a Payment Method --</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.label} • {method.description}
                    </option>
                  ))}
                </select>

                {/* Dropdown arrow icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gaming-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Selected method info */}
              {paymentMethod && (
                <div className="mt-4 p-4 rounded-lg bg-gaming-accent/10 border border-gaming-accent/30">
                  <p className="text-sm text-gaming-secondary">Selected payment method:</p>
                  <p className="font-bold text-gaming-accent">
                    {paymentMethods.find(m => m.id === paymentMethod)?.label}
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 rounded-lg bg-gaming-surface/50 border border-gaming-accent/20">
              <p className="text-sm text-gaming-secondary">
                ℹ️ This is a demo payment gateway. Your payment is simulated and no real charges will be made.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit sticky top-24 p-6 rounded-lg border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>

            <div className="space-y-3 border-t border-gaming-accent/20 pt-4">
              <div className="flex justify-between text-gaming-secondary">
                <span>Subtotal:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-gaming-accent border-t border-gaming-accent/20 pt-4">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !paymentMethod}
              className="w-full mt-6 px-6 py-3 rounded-lg bg-gaming-accent text-white font-bold hover:bg-gaming-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Payment...' : 'Complete Purchase'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="w-full mt-3 px-6 py-3 rounded-lg border border-gaming-accent/20 text-gaming-secondary hover:text-gaming-accent hover:border-gaming-accent/50 transition-all"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
