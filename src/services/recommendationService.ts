import api from './api'

export async function getRecommendations(userId?: number, limit = 8) {
  const params: any = { limit }
  if (userId) params.user_id = userId
  const resp = await api.get('/api/recommendations', { params })
  return resp.data
}

export async function getRecommendationsForGame(gameId: number, limit = 8) {
  const resp = await api.get(`/api/recommendations/${gameId}`, { params: { limit } })
  return resp.data
}
