import { DollarSign } from 'lucide-react'

interface Props {
  itemCount: number
  totalAmount: number
  onCheckout: () => void
  isLoading?: boolean
}

export default function CheckoutSummary({ itemCount, totalAmount, onCheckout, isLoading }: Props) {
  return (
    <div className="w-full md:w-80 p-4 rounded-lg border border-gaming-accent/20 bg-gaming-card/95 backdrop-blur-md shadow-lg h-full">
      <h3 className="text-xl font-bold text-white mb-3">Order Summary</h3>

      <div className="space-y-3 border-t border-gaming-accent/20 pt-4">
        <div className="flex justify-between text-gaming-secondary">
          <span>Items:</span>
          <span className="font-semibold text-white">{itemCount}</span>
        </div>

        <div className="flex justify-between text-lg font-bold text-gaming-accent">
          <span>Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Global checkout button removed in favor of per-item and page-level checkout actions */}
    </div>
  )
}
