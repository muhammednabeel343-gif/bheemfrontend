import axios from 'axios'
import type { FavoriteItem } from '../types/game'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
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
  const response = await api.post(
    '/favorites',
    { game_id: gameId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

export async function removeFavorite(token: string, gameId: number): Promise<void> {
  await api.delete(`/favorites/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
