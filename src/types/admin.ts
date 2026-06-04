export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminProfile {
  id: number
  username: string
  email: string
}

export interface AdminContextValue {
  token: string | null
  admin: AdminProfile | null
  loading: boolean
  signIn: (payload: AdminLoginRequest) => Promise<void>
  signOut: () => void
}