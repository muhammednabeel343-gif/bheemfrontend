import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

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
  onClose: () => void
  onUpdate: (profile: UserProfile) => void
}

export default function EditProfileModal({ profile, onClose, onUpdate }: Props) {
  const { token } = useAuth()
  const [username, setUsername] = useState(profile.username)
  const [email, setEmail] = useState(profile.email)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!username.trim()) {
      setError('Username is required')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      const updateData: any = {
        username,
        email,
      }

      if (password) {
        updateData.password = password
      }

      // Call API to update profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const updatedProfile: UserProfile = {
        ...profile,
        username,
        email,
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        onUpdate(updatedProfile)
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-gaming-accent/20 bg-gaming-card shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gaming-surface border-b border-gaming-accent/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gaming-accent/20 text-gaming-secondary hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-status-not-recommended/10 border border-status-not-recommended/30 text-status-not-recommended text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-lg bg-status-excellent/10 border border-status-excellent/30 text-status-excellent text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 text-white placeholder-gaming-secondary/50 transition-all focus:outline-none focus:ring-2 focus:ring-gaming-accent focus:border-gaming-accent"
                placeholder="Enter your username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 text-white placeholder-gaming-secondary/50 transition-all focus:outline-none focus:ring-2 focus:ring-gaming-accent focus:border-gaming-accent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 text-white placeholder-gaming-secondary/50 transition-all focus:outline-none focus:ring-2 focus:ring-gaming-accent focus:border-gaming-accent"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm Password */}
            {password && (
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 text-white placeholder-gaming-secondary/50 transition-all focus:outline-none focus:ring-2 focus:ring-gaming-accent focus:border-gaming-accent"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-gaming-accent/20 text-gaming-secondary hover:bg-gaming-surface/50 font-medium transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 text-white font-medium transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
