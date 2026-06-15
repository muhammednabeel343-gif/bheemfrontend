const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface PurchasedGame {
  id: number
  user_id: number
  game_id: number
  game_name: string
  image_url?: string
  genre?: string
  purchase_date: string
}

export interface UserLibrary {
  games: PurchasedGame[]
  total_count: number
}

export async function getUserLibrary(token: string): Promise<UserLibrary> {
  const response = await fetch(`${API_BASE_URL}/purchases/library`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch library')
  }

  return response.json()
}

export async function getPurchaseCount(token: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/purchases/count`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch purchase count')
  }

  const data = await response.json()
  return data.total_purchased
}

export async function checkPurchase(token: string, gameId: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/purchases/${gameId}/check`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to check purchase status')
  }

  const data = await response.json()
  return data.is_purchased
}
