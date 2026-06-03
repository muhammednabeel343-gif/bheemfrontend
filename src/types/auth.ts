export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  avatar_url?: string | null
}

export interface AuthContextValue {
  token: string | null
  user: UserProfile | null
  loading: boolean
  signIn: (payload: LoginRequest) => Promise<void>
  signUp: (payload: RegisterRequest) => Promise<void>
  signOut: () => void
}
