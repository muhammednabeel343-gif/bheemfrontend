import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Cpu, HardDrive, Lock } from 'lucide-react'
import { getGameDetails } from '../services/gameService'
import { addToCart } from '../services/cartService'
import { checkPurchase } from '../services/purchaseService'
import type { GameDetail, Requirement } from '../types/game'

interface GameWithDescription extends GameDetail {
  description?: string
  price?: number
}

export default function GameDetailsPage() {
  const { gameId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [game, setGame] = useState<GameWithDescription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)

  useEffect(() => {
    const loadGame = async () => {
      if (!token || !gameId) return

      setLoading(true)
      setError('')

      try {
        const details = await getGameDetails(token, parseInt(gameId))
        const foundGame = details as GameWithDescription

        if (foundGame) {
          setGame(foundGame)

          // Check if purchased
          const purchased = await checkPurchase(token, foundGame.id)
          setIsPurchased(purchased)
        } else {
          setError('Game not found')
        }
      } catch (err) {
        setError('Failed to load game details')
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [token, gameId])

  const handleAddToCart = async () => {
    if (!token || !game) return

    setAddingToCart(true)
    try {
      await addToCart(token, game.id)
      alert('Added to cart!')
    } catch (err) {
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
        <p className="text-gaming-secondary">Loading game details...</p>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gaming-bg flex flex-col items-center justify-center gap-4">
        <p className="text-status-not-recommended">{error || 'Game not found'}</p>
        <button
          onClick={() => navigate('/library')}
          className="px-6 py-3 rounded-lg bg-gaming-accent text-white font-bold hover:bg-gaming-accent/90"
        >
          Back to Library
        </button>
      </div>
    )
  }

  const req = game.requirements && game.requirements.length > 0 ? game.requirements[0] : null

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button removed as requested */}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Game Image with Name & Genre overlay and Add to Cart */}
          <div className="lg:w-1/3 flex flex-col flex-shrink-0">
            {/* Image wrapper with padding to match library card fit */}
           <div className="mb-4">
              <div className="rounded-xl overflow-hidden bg-gaming-card border border-gaming-accent/20 shadow-xl">
              <div className="aspect-[3/4] w-full">
                  {game.image_url && (
                    <img
                      src={game.image_url}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 pointer-events-none"></div>
              </div>
            </div>

            {/* Game Name & Genre with Add to Cart button gap */}
           <div className="flex items-center justify-between mt-4 gap-4">

  <div className="flex-1">
    <h1 className="text-3xl font-bold text-white">
      {game.name}
    </h1>

    <p className="text-gaming-secondary mt-1">
      {game.genre}
    </p>
  </div>

  {isPurchased ? (
    <div className="rounded-lg bg-status-recommended/20 border border-status-recommended text-status-recommended px-5 py-3 flex items-center gap-2">
      <Lock size={16}/>
      Owned
    </div>
  ) : (
    <button
      onClick={handleAddToCart}
      disabled={addingToCart}
      className="rounded-lg bg-gaming-accent hover:bg-gaming-accent/90 transition-all px-6 py-3 text-white font-semibold flex items-center gap-2"
    >
      <Zap size={18}/>
      {addingToCart ? "Adding..." : "Add to Cart"}
    </button>
  )}

</div>
          </div>

          {/* Right: Combined Description + Requirements card */}
          <div className="lg:w-2/3">
            <div className="h-96 rounded-xl bg-gaming-card/50 border border-gaming-accent/20 overflow-hidden shadow-xl">
              <div className="h-full flex flex-col">
                {/* Description */}
                {game.description && (
                  <div className="p-4 border-b border-gaming-accent/20 overflow-hidden">
                    <p className="text-white text-sm leading-relaxed">{game.description}</p>
                  </div>
                )}

                {/* Minimum Requirements - Including OS */}
                {req && (
                  <div className="p-4 overflow-hidden">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                      <Cpu size={18} />
                      Minimum Requirements
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                      {req?.cpu && (
                        <div className="p-3 rounded-lg bg-gaming-surface/50">
                          <p className="text-gaming-secondary text-xs">CPU</p>
                          <p className="text-white font-semibold text-xs line-clamp-1">{req.cpu}</p>
                        </div>
                      )}
                      {req?.gpu && (
                        <div className="p-3 rounded-lg bg-gaming-surface/50">
                          <p className="text-gaming-secondary text-xs">GPU</p>
                          <p className="text-white font-semibold text-xs line-clamp-1">{req.gpu}</p>
                        </div>
                      )}
                      {req?.ram_gb !== undefined && (
                        <div className="p-3 rounded-lg bg-gaming-surface/50">
                          <p className="text-gaming-secondary text-xs">RAM</p>
                          <p className="text-white font-semibold text-xs">{req.ram_gb} GB</p>
                        </div>
                      )}
                      {req?.storage_gb !== undefined && (
                        <div className="p-3 rounded-lg bg-gaming-surface/50">
                          <p className="text-gaming-secondary text-xs">Storage</p>
                          <p className="text-white font-semibold text-xs">{req.storage_gb} GB</p>
                        </div>
                      )}
                      {req?.operating_system && (
                        <div className="p-3 rounded-lg bg-gaming-surface/50 sm:col-span-2 lg:col-span-1">
                          <p className="text-gaming-secondary text-xs">OS</p>
                          <p className="text-white font-semibold text-xs line-clamp-1">{req.operating_system}</p>
                        </div>
                      )}
                      {req?.directx && (
                        <div className="p-3 rounded-lg bg-gaming-surface/50 sm:col-span-2 lg:col-span-1">
                          <p className="text-gaming-secondary text-xs">DirectX</p>
                          <p className="text-white font-semibold text-xs line-clamp-1">{req.directx}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
