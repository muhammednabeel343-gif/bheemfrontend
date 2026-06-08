import { Edit2 } from 'lucide-react'
import { useState } from 'react'

interface UserProfile {
  id: number
  username: string
  email: string
  avatar_url?: string
  member_since: string
  bio?: string
}

interface Props {
  profile: UserProfile
  isOwnProfile: boolean
  onEditClick: () => void
}

export default function UserHeader({ profile, isOwnProfile, onEditClick }: Props) {
  return (
    <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 mb-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
          <p className="text-gaming-accent mt-2 font-medium">{profile.email}</p>
        </div>

        {/* Actions */}
        {isOwnProfile && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 text-white font-medium transition-all duration-300"
          >
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  )
}
