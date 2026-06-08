import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSystemScan, saveSystemScan, deleteSystemScan } from '../../services/systemService'
import type { SystemScan } from '../../types/game'
import SystemDisplay from './SystemDisplay'
import SystemForm from './SystemForm'
import { Edit2, Trash2, AlertCircle } from 'lucide-react'

export default function MySystem() {
  const { token } = useAuth()
  const [system, setSystem] = useState<SystemScan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadSystem()
  }, [token])

  const loadSystem = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError('')
      const data = await getSystemScan(token)
      setSystem(data)
      setShowForm(false)
    } catch (err: any) {
      setSystem(null)
      setShowForm(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSystem = async (formData: SystemScan) => {
    if (!token) return

    try {
      setError('')
      const saved = await saveSystemScan(token, formData)
      setSystem(saved)
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save system')
    }
  }

  const handleDeleteSystem = async () => {
    if (!token || !system) return

    if (!window.confirm('Are you sure you want to delete your system configuration? This cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      setError('')
      await deleteSystemScan(token)
      setSystem(null)
      setShowForm(true)
    } catch (err: any) {
      setError(err.message || 'Failed to delete system')
    } finally {
      setDeleting(false)
    }
  }

  const handleEditClick = () => {
    setShowForm(true)
  }

  const handleCancel = () => {
    if (system) {
      setShowForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">My System</h1>
            <p className="mt-2 text-gaming-secondary">
              Manage your PC specifications for compatibility checking
            </p>
          </div>

          {!showForm && system && (
            <div className="flex gap-2">
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 px-4 py-2 text-sm font-medium text-white transition-all duration-300 shadow-glow"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={handleDeleteSystem}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-status-not-recommended/20 hover:bg-status-not-recommended/30 border border-status-not-recommended/50 px-4 py-2 text-sm font-medium text-status-not-recommended transition-all duration-300 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-status-not-recommended/30 bg-status-not-recommended/10 p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-status-not-recommended flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-status-not-recommended font-medium">Error</p>
              <p className="text-sm text-status-not-recommended/80">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
            <p className="mt-4 text-gaming-secondary">Loading your system...</p>
          </div>
        ) : showForm ? (
          <SystemForm
            initialData={system}
            onSave={handleSaveSystem}
            onCancel={handleCancel}
          />
        ) : system ? (
          <SystemDisplay system={system} />
        ) : null}
      </div>
    </div>
  )
}
