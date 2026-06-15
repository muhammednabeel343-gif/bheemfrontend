import axios from 'axios'
import type { ChatSession, ChatMessage, SendMessageResponse } from '../types/chat'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

// Sessions
export async function getSessions(token: string): Promise<ChatSession[]> {
  const res = await api.get('/api/chat/sessions', { headers: authHeader(token) })
  return res.data
}

export async function createSession(token: string, title = 'New Chat'): Promise<ChatSession> {
  const res = await api.post('/api/chat/sessions', { title }, { headers: authHeader(token) })
  return res.data
}

export async function renameSession(token: string, sessionId: number, title: string): Promise<ChatSession> {
  const res = await api.patch(`/api/chat/sessions/${sessionId}`, { title }, { headers: authHeader(token) })
  return res.data
}

export async function deleteSession(token: string, sessionId: number): Promise<void> {
  await api.delete(`/api/chat/sessions/${sessionId}`, { headers: authHeader(token) })
}

// Messages
export async function getMessages(token: string, sessionId: number): Promise<ChatMessage[]> {
  const res = await api.get(`/api/chat/sessions/${sessionId}/messages`, { headers: authHeader(token) })
  return res.data
}

export async function sendMessage(token: string, sessionId: number, message: string): Promise<SendMessageResponse> {
  const res = await api.post(
    `/api/chat/sessions/${sessionId}/messages`,
    { message },
    { headers: authHeader(token) },
  )
  return res.data
}
