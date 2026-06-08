export interface GameSummary {
  id: number
  name: string
  genre: string
  image_url?: string | null
  is_favorite: boolean
}

export interface Requirement {
  id: number
  cpu: string
  gpu: string
  ram: number
  storage: number
  directx?: string | null
  os?: string | null
}

export interface GameDetail {
  id: number
  name: string
  genre: string
  publisher?: string | null
  release_date?: string | null
  image_url?: string | null
  requirements: Requirement[]
  is_favorite: boolean
}

export interface GameListResponse {
  games: GameSummary[]
  total: number
  page: number
  limit: number
}

export interface FavoriteItem {
  id: number
  game_id: number
  name: string
  genre?: string | null
  image_url?: string | null
}

export interface SystemScan {
  cpu: string
  gpu: string
  ram_gb: number
  storage_gb: number
  operating_system?: string | null
}

export interface FpsEstimate {
  low: number
  medium: number
  high: number
  ultra: number
}

export interface CompatibilityCheck {
  cpu_pass: boolean
  gpu_pass: boolean
  ram_pass: boolean
  storage_pass: boolean
  os_pass: boolean
}

export interface CompatibilityReport {
  minimum_requirements: {
    cpu: string
    gpu: string
    ram_gb: number
    storage_gb: number
    directx?: string | null
    operating_system?: string | null
  }
  user_specs: SystemScan
  checks: CompatibilityCheck
  compatibility_percentage: number
  status: string
  estimated_fps: FpsEstimate
}