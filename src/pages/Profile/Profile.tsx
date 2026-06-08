import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UserHeader from './UserHeader'
import CurrentSystem from './CurrentSystem'
import FavoriteGames from './FavoriteGames'
import SystemInsights from './SystemInsights'
import EditProfileModal from './EditProfileModal'

interface UserProfile {
  id: number
  username: string
  email: string
  avatar_url?: string
  member_since: string
  bio?: string
}

export default function Profile() {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser, token } = useAuth()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const profileId = userId ? parseInt(userId) : currentUser?.id

  useEffect(() => {
    const loadProfile = async () => {
      if (!token || !profileId) return

      try {
        setLoading(true)
        setError('')

        setIsOwnProfile(!userId || parseInt(userId) === currentUser?.id)

        // Load current user profile
        const mockProfile: UserProfile = {
          id: profileId,
          username: currentUser?.username || 'gaming_enthusiast',
          email: currentUser?.email || 'user@example.com',
          member_since: '2024-01-15',
        }

        setProfile(mockProfile)
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [token, profileId, userId, currentUser?.id])

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
    setShowEditModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
            <p className="mt-4 text-gaming-secondary">Loading profile…</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-status-not-recommended/30 bg-status-not-recommended/10 p-8 text-center">
            <p className="text-status-not-recommended">
              {error || 'User profile not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* User Header */}
        <UserHeader profile={profile} isOwnProfile={isOwnProfile} onEditClick={() => setShowEditModal(true)} />

        {/* Current System */}
        <CurrentSystem isOwnProfile={isOwnProfile} />

        {/* Favorite Games */}
        <FavoriteGames />

        {/* System Insights */}
        <SystemInsights />

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            profile={profile}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  )
}
