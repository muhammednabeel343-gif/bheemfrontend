import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import type { FavoriteItem } from '../types/game'
import { getFavorites, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi } from '../services/favoriteService'

interface FavoritesContextValue {
  favorites: FavoriteItem[]
  loading: boolean
  refreshFavorites: () => Promise<void>
  addFavorite: (gameId: number) => Promise<void>
  removeFavorite: (gameId: number) => Promise<void>
  isFavorite: (gameId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  const refreshFavorites = async () => {
    if (!token) {
      setFavorites([])
      return
    }
    setLoading(true)
    try {
      const response = await getFavorites(token)
      setFavorites(response.favorites)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshFavorites()
  }, [token])

  const addFavorite = async (gameId: number) => {
    if (!token) return
    await addFavoriteApi(token, gameId)
    await refreshFavorites()
  }

  const removeFavorite = async (gameId: number) => {
    if (!token) return
    await removeFavoriteApi(token, gameId)
    setFavorites((current) => current.filter((item) => item.game_id !== gameId))
  }

  const value = useMemo(
    () => ({
      favorites,
      loading,
      refreshFavorites,
      addFavorite,
      removeFavorite,
      isFavorite: (gameId: number) => favorites.some((item) => item.game_id === gameId),
    }),
    [favorites, loading],
  )


  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider')
  }
  return context
}
