import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser, fetchCurrentUser } from '../services/authService'
import type { AuthContextValue, LoginRequest, RegisterRequest, UserProfile } from '../types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const tokenStorageKey = 'bheem_auth_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenStorageKey))
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initialize = async () => {
      if (token) {
        try {
          const profile = await fetchCurrentUser(token)
          setUser(profile)
        } catch {
          setToken(null)
          localStorage.removeItem(tokenStorageKey)
        }
      }
      setLoading(false)
    }

    initialize()
  }, [token])

  const signIn = async (payload: LoginRequest) => {
    const response = await loginUser(payload)
    localStorage.setItem(tokenStorageKey, response.access_token)
    setToken(response.access_token)
    const profile = await fetchCurrentUser(response.access_token)
    setUser(profile)
    navigate('/')
  }

  const signUp = async (payload: RegisterRequest) => {
    const response = await registerUser(payload)
    localStorage.setItem(tokenStorageKey, response.access_token)
    setToken(response.access_token)
    const profile = await fetchCurrentUser(response.access_token)
    setUser(profile)
    navigate('/')
  }

  const signOut = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(tokenStorageKey)
    navigate('/login')
  }

  const value = useMemo(
    () => ({ token, user, loading, signIn, signUp, signOut }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
