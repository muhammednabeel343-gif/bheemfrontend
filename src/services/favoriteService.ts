import axios from 'axios'
import type { FavoriteItem } from '../types/game'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getFavorites(token: string): Promise<{ favorites: FavoriteItem[] }> {
  const response = await api.get('/favorites', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function addFavorite(token: string, gameId: number): Promise<FavoriteItem> {
  try {
    const response = await api.post(
      '/favorites',
      { game_id: gameId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (e: any) {
    if (e?.response?.status === 409) {
      return { id: 0, game_id: gameId, name: '', genre: '', image_url: '' } as FavoriteItem
    }
    throw e
  }
}

export async function removeFavorite(token: string, gameId: number): Promise<void> {
  await api.delete(`/favorites/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
