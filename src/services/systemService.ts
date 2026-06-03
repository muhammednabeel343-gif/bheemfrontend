import axios from 'axios'
import type { CompatibilityReport, SystemScan } from '../types/game'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getSystemScan(token: string): Promise<SystemScan> {
  try {
    const response = await api.get('/system/scan', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (err: any) {
    console.error('getSystemScan error', err)
    throw formatAxiosError(err)
  }
}

export async function saveSystemScan(token: string, payload: SystemScan & { game_id?: number }): Promise<SystemScan> {
  try {
    const response = await api.post('/system/save-scan', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (err: any) {
    console.error('saveSystemScan error', err)
    throw formatAxiosError(err)
  }
}

export async function getCompatibilityReport(token: string, gameId: number): Promise<CompatibilityReport> {
  try {
    const response = await api.post(`/games/${gameId}/compatibility`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (err: any) {
    console.error('getCompatibilityReport error', err)
    throw formatAxiosError(err)
  }
}

export async function getCpuOptions(token: string) {
  const response = await api.get('/system/hardware/cpus', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function getGpuOptions(token: string) {
  const response = await api.get('/system/hardware/gpus', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

function formatAxiosError(err: any) {
  if (!err) return new Error('Unknown network error')
  if (err.response) {
    const status = err.response.status
    const detail = err.response.data?.detail || JSON.stringify(err.response.data)
    return new Error(`HTTP ${status}: ${detail}`)
  }
  if (err.request) {
    return new Error('No response received from server (network error or CORS)')
  }
  return new Error(err.message || 'Network error')
}
export async function simulateCompatibility(
  token: string,
  payload: {
    game_id: number
    cpu: string
    gpu: string
    ram_gb: number
    storage_gb: number
  }
) {
  const response = await api.post(
    '/system/simulate',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}