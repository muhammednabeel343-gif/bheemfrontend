import axios from 'axios'
import type { GameListResponse, GameDetail } from '../types/game'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getGames(
  token: string,
  search?: string,
  category?: string,
  page = 1,
  limit = 20,
): Promise<GameListResponse> {
  const params: Record<string, string | number> = { page, limit }
  if (search) params.search = search
  if (category) params.category = category

  const response = await api.get('/games', {
    params,
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getGameDetails(token: string, gameId: number): Promise<GameDetail> {
  const response = await api.get(`/games/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
