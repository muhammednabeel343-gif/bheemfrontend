const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface CartItem {
  id: number
  game_id: number
  game_name: string
  price: number
  image_url?: string
  created_at: string
}

export interface Cart {
  items: CartItem[]
  count: number
  total_amount: number
}

export async function addToCart(token: string, gameId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ game_id: gameId }),
  })

  if (!response.ok) {
    throw new Error('Failed to add to cart')
  }
}

export async function removeFromCart(token: string, gameId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ game_id: gameId }),
  })

  if (!response.ok) {
    throw new Error('Failed to remove from cart')
  }
}

export async function getCart(token: string): Promise<Cart> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cart')
  }

  return response.json()
}

export async function getCartCount(token: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/cart/count`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cart count')
  }

  const data = await response.json()
  return data.count
}

export async function clearCart(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to clear cart')
  }
}
