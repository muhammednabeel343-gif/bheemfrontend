import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useFavorites from '../hooks/useFavorites'
import { getSystemScan, saveSystemScan, getCompatibilityReport } from '../services/systemService'
import type { CompatibilityReport, FavoriteItem, SystemScan } from '../types/game'
import CompatibilityReportComponent from '../components/CompatibilityReport'
import { useNavigate } from 'react-router-dom'

function FavoritesPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { favorites, loading, removeFavorite } = useFavorites()
  const [items, setItems] = useState<FavoriteItem[]>(favorites)
  const [reports, setReports] = useState<Record<number, CompatibilityReport>>({})
  const [scanningGameId, setScanningGameId] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')

  useEffect(() => {
    setItems(favorites)
  }, [favorites])

  
  const scanCompatibility = async (favorite: FavoriteItem) => {
   if (!token) {
     setStatusMessage('Please sign in to scan your system and view compatibility.')
     return
   }

   setScanningGameId(favorite.game_id)
   setStatusMessage('Scanning system...')

   try {
     const serverScan = await getSystemScan(token)

await saveSystemScan(token, {
  ...serverScan,
  game_id: favorite.game_id,
})

     const report = await getCompatibilityReport(token, favorite.game_id)

     navigate(`/compatibility/${favorite.game_id}`,
     {
       state: {
         game: favorite,
       },
     } )
     setStatusMessage('Scan complete — compatibility report is ready.')
   } catch (error: any) {
     if (error?.response?.status === 401) {
       setStatusMessage('You must be signed in to scan. Please log in and try again.')
     } else if (error?.response?.data?.detail) {
       setStatusMessage(String(error.response.data.detail))
     } else if (error?.message) {
       setStatusMessage(String(error.message))
     } else {
       setStatusMessage('Unable to complete the scan. Please try again.')
     }
   } finally {
     setScanningGameId(null)
   }
 }
  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Your Favorites</h1>
          <p className="text-gaming-secondary mt-2">Games you've saved for quick access</p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
            <p className="mt-4 text-gaming-secondary">Loading favorites…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <p className="text-gaming-secondary">You haven't added any favorites yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {statusMessage && (
              <div className="rounded-xl border border-gaming-accent/30 bg-gaming-surface/50 p-4 text-sm text-gaming-accent">
                {statusMessage}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((favorite) => (
                <div key={favorite.id} className="group rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm overflow-hidden hover:border-gaming-accent/50 transition-all duration-300 hover:shadow-glow">
                  <div className="relative w-full h-56 overflow-hidden bg-gaming-surface">
                    <img
                      src={favorite.image_url ?? 'https://via.placeholder.com/640x360?text=Game'}
                      alt={favorite.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 space-y-4">
                    <h3 className="font-bold text-white group-hover:text-gaming-accent transition-colors">
                      {favorite.name}
                    </h3>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void scanCompatibility(favorite)}
                        disabled={scanningGameId === favorite.game_id}
                        className="flex-1 rounded-lg bg-gaming-accent hover:bg-gaming-accent-hover text-white px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50"
                      >
                        {scanningGameId === favorite.game_id ? 'Scanning...' : 'Check'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeFavorite(favorite.game_id)}
                        className="flex-1 rounded-lg bg-status-not-recommended/80 hover:bg-status-not-recommended text-white px-4 py-2 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage