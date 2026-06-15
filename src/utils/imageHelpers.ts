import type { SyntheticEvent } from 'react'

export const FALLBACK_GAME_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#0f172a"/><text x="50%" y="50%" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="32" text-anchor="middle" dominant-baseline="middle">No Image Available</text></svg>',
)}`

export function getGameImageSrc(imageUrl?: string | null) {
  if (!imageUrl) return FALLBACK_GAME_IMAGE
  if (imageUrl.startsWith('http')) return imageUrl
  if (imageUrl.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_BASE_URL || window.location.origin}${imageUrl}`
  }
  return FALLBACK_GAME_IMAGE
}

export function handleGameImageError(event: SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget
  if (img.src !== FALLBACK_GAME_IMAGE) {
    img.src = FALLBACK_GAME_IMAGE
  }
}
