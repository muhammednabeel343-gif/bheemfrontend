import { useState, useEffect } from 'react'
import { getRecommendations } from '../services/recommendationService'
import { useAuth } from '../contexts/AuthContext'

export default function useRecommendations(limit = 6) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const data = await getRecommendations(user?.id, limit)
        if (!mounted) return
        setRecommendations(data.recommendations || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load recommendations')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user?.id, limit])

  return { loading, recommendations, error }
}
