const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface OrderItem {
  id: number
  game_id: number
  game_name: string
  price: number
  image_url?: string
}

export interface Order {
  id: number
  user_id: number
  total_amount: number
  payment_method: string
  status: string
  created_at: string
  items: OrderItem[]
}

export async function createOrder(
  token: string,
  gameIds: number[],
  totalAmount: number,
  paymentMethod: string
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      game_ids: gameIds,
      total_amount: totalAmount,
      payment_method: paymentMethod,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  return response.json()
}

export async function getOrders(token: string): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }

  return response.json()
}

export async function getOrder(token: string, orderId: number): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch order')
  }

  return response.json()
}

export async function simulatePayment(
  token: string,
  orderId: number,
  success: boolean = true
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/simulate-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ success }),
  })

  if (!response.ok) {
    throw new Error('Payment simulation failed')
  }

  return response.json()
}

export async function completeOrder(token: string, orderId: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to complete order')
  }

  return response.json()
}
