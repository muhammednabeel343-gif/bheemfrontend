import { useAuth } from '../../contexts/AuthContext'
import type { SystemScan } from '../../types/game'
import CPUSelector from './CPUSelector'
import GPUSelector from './GPUSelector'
import RAMDropdown from './RAMDropdown'
import StorageInput from './StorageInput'
import OSSelector from './OSSelector'
import { useState } from 'react'
import { X, Check } from 'lucide-react'

interface Props {
  initialData: SystemScan | null
  onSave: (data: SystemScan) => Promise<void>
  onCancel: () => void
}

export default function SystemForm({ initialData, onSave, onCancel }: Props) {
  const { token } = useAuth()
  const [formData, setFormData] = useState<SystemScan>({
    cpu: initialData?.cpu || '',
    gpu: initialData?.gpu || '',
    ram_gb: initialData?.ram_gb || '',
    storage_gb: initialData?.storage_gb || '',
    operating_system: initialData?.operating_system || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.cpu.trim()) {
      newErrors.cpu = 'Processor is required'
    }

    if (!formData.gpu.trim()) {
      newErrors.gpu = 'Graphics card is required'
    }

    if (!formData.ram_gb || formData.ram_gb < 1 || formData.ram_gb > 256) {
      newErrors.ram_gb = 'RAM must be between 1 and 256 GB'
    }

    if (!formData.storage_gb || formData.storage_gb < 10 || formData.storage_gb > 10000) {
      newErrors.storage_gb = 'Storage must be between 10 and 10000 GB'
    }

    if (!formData.operating_system?.trim()) {
      newErrors.operating_system = 'Operating system is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await onSave(formData)
    } catch (err) {
      console.error('Form submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hardware Configuration Section */}
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
        <h2 className="mb-2 text-xl font-bold text-white">
          {initialData ? 'Update Your Hardware' : 'Configure Your Hardware'}
        </h2>
        <p className="mb-6 text-sm text-gaming-secondary">
          Select your processor, graphics card, and memory specifications from your system
        </p>

        <div className="space-y-6">
          {/* CPU Selector */}
          <CPUSelector
            value={formData.cpu}
            onChange={(value) => {
              setFormData({ ...formData, cpu: value })
              if (errors.cpu) setErrors({ ...errors, cpu: '' })
            }}
            token={token}
            error={errors.cpu}
          />

          {/* GPU Selector */}
          <GPUSelector
            value={formData.gpu}
            onChange={(value) => {
              setFormData({ ...formData, gpu: value })
              if (errors.gpu) setErrors({ ...errors, gpu: '' })
            }}
            token={token}
            error={errors.gpu}
          />

          {/* RAM Input - Dropdown */}
          <div className="rounded-lg bg-gaming-surface/50 p-4">
            <RAMDropdown
              value={formData.ram_gb}
              onChange={(value) => {
                setFormData({ ...formData, ram_gb: value })
                if (errors.ram_gb) setErrors({ ...errors, ram_gb: '' })
              }}
              error={errors.ram_gb}
            />
          </div>

          {/* Storage Input - Slider */}
          <div className="rounded-lg bg-gaming-surface/50 p-4">
            <StorageInput
              value={formData.storage_gb}
              onChange={(value) => {
                setFormData({ ...formData, storage_gb: value })
                if (errors.storage_gb) setErrors({ ...errors, storage_gb: '' })
              }}
              error={errors.storage_gb}
            />
          </div>
        </div>
      </div>

      {/* Operating System Section */}
      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
        <h2 className="mb-2 text-xl font-bold text-white">
          Operating System
        </h2>
        <p className="mb-6 text-sm text-gaming-secondary">
          Select your operating system
        </p>

        <div className="bg-gaming-surface/50 rounded-lg p-4">
          <OSSelector
            value={formData.operating_system || ''}
            onChange={(value) => {
              setFormData({ ...formData, operating_system: value })
              if (errors.operating_system) setErrors({ ...errors, operating_system: '' })
            }}
            token={token}
            error={errors.operating_system}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 disabled:opacity-50 px-6 py-3 font-medium text-white transition-all duration-300 shadow-glow"
        >
          <Check size={18} />
          {loading ? 'Saving...' : 'Save System'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gaming-accent/20 hover:border-gaming-accent/50 px-6 py-3 font-medium text-white transition-all duration-300"
        >
          <X size={18} />
          Cancel
        </button>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-gaming-accent/20 bg-gaming-accent/5 p-4">
        <p className="text-sm text-gaming-secondary">
          💡 <span className="text-white font-medium">Tip:</span> Your system information will be
          used to check game compatibility and estimate FPS performance.
        </p>
      </div>
    </form>
  )
}
