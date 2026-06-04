import axios from 'axios'
import type { LoginRequest, RegisterRequest, TokenResponse, UserProfile } from '../types/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function registerUser(payload: RegisterRequest): Promise<TokenResponse> {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export async function loginUser(payload: LoginRequest): Promise<TokenResponse> {
  const response = await api.post('/auth/login', payload)
  return response.data
}

export async function fetchCurrentUser(token: string): Promise<UserProfile> {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
