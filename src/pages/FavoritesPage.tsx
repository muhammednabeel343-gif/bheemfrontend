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
 <div className="mx-auto max-w-6xl px-10 pt-4 pb-8">
      <div className="mb-4">
        
        <h1 className="text-3xl font-semibold text-slate-900">Your Favorites</h1>
      
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading favorites…</div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          You haven’t added any favorites yet.
        </div>
      ) : (
        <div className="space-y-6">
          {statusMessage && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              {statusMessage}
            </div>
          )}

  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((favorite) => (
  <div key={favorite.id} className="space-y-3">

    <article
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
   <div className="h-82 overflow-hidden rounded-3xl">
  <img
    src={favorite.image_url ?? 'https://via.placeholder.com/420x600?text=Game'}
    alt={favorite.name}
    className="h-full w-full object-cover"
  />
</div>
    </article>

    <div className="flex gap-3">
     
      

      <button
        type="button"
        onClick={() => void removeFavorite(favorite.game_id)}
        className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
      >
        Remove Favorite
      </button>
    </div>

  </div>
))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage