import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getGames, getGameDetails } from '../../services/gameService'
import { getCpuOptions, getGpuOptions, getRamOptions, getStorageOptions, getOsOptions, simulateCompatibility } from '../../services/systemService'
import type { GameSummary, CompatibilityReport } from '../../types/game'
import { Zap, AlertCircle, Check, Cpu, Gpu, Database, Monitor, HardDrive, ChevronDown } from 'lucide-react'
import Button from '../../components/Button/Button'

export default function Simulator() {
  const { token } = useAuth()
  const [games, setGames] = useState<GameSummary[]>([])
  const [cpus, setCpus] = useState<any[]>([])
  const [gpus, setGpus] = useState<any[]>([])
  const [rams, setRams] = useState<any[]>([])
  const [storages, setStorages] = useState<any[]>([])
  const [oses, setOses] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [error, setError] = useState('')

  const [isCpuOpen, setIsCpuOpen] = useState(false)
  const [isGpuOpen, setIsGpuOpen] = useState(false)
  const [isRamOpen, setIsRamOpen] = useState(false)
  const [isOsOpen, setIsOsOpen] = useState(false)
  const [isGameOpen, setIsGameOpen] = useState(false)

  const cpuDropdownRef = useRef<HTMLDivElement>(null)
  const gpuDropdownRef = useRef<HTMLDivElement>(null)
  const ramDropdownRef = useRef<HTMLDivElement>(null)
  const osDropdownRef = useRef<HTMLDivElement>(null)
  const gameDropdownRef = useRef<HTMLDivElement>(null)

  const [selectedCpu, setSelectedCpu] = useState('')
  const [selectedGpu, setSelectedGpu] = useState('')
  const [selectedRam, setSelectedRam] = useState(0)
  const [selectedStorage, setSelectedStorage] = useState(0)
  const [selectedOs, setSelectedOs] = useState('')
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  const [result, setResult] = useState<CompatibilityReport | null>(null)

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cpuDropdownRef.current && !cpuDropdownRef.current.contains(event.target as Node)) {
        setIsCpuOpen(false)
      }
      if (gpuDropdownRef.current && !gpuDropdownRef.current.contains(event.target as Node)) {
        setIsGpuOpen(false)
      }
      if (ramDropdownRef.current && !ramDropdownRef.current.contains(event.target as Node)) {
        setIsRamOpen(false)
      }
      if (osDropdownRef.current && !osDropdownRef.current.contains(event.target as Node)) {
        setIsOsOpen(false)
      }
      if (gameDropdownRef.current && !gameDropdownRef.current.contains(event.target as Node)) {
        setIsGameOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!token) return

      try {
        setLoading(true)
        setError('')

        const [gamesData, cpuData, gpuData, ramData, storageData, osData] = await Promise.all([
          getGames(token, '', '', 1, 100),
          getCpuOptions(token),
          getGpuOptions(token),
          getRamOptions(token),
          getStorageOptions(token),
          getOsOptions(token),
        ])

        setGames(gamesData.games || [])
        setCpus(cpuData)
        setGpus(gpuData)
        setRams(ramData)
        setStorages(storageData)
        setOses(osData)
      } catch (err: any) {
        setError(err.message || 'Failed to load simulator data')
        console.error('Error loading simulator:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  const handleSimulate = async () => {
    if (!selectedGame || !selectedCpu || !selectedGpu || !selectedOs) {
      setError('Please select a game, CPU, GPU, and Operating System')
      return
    }

    try {
      setSimulating(true)
      setError('')

      const response = await simulateCompatibility(token!, {
        game_id: selectedGame,
        cpu: selectedCpu,
        gpu: selectedGpu,
        ram_gb: selectedRam,
        storage_gb: selectedStorage,
        operating_system: selectedOs,
      })

      setResult(response)
    } catch (err: any) {
      setError(err.message || 'Failed to run simulation')
      console.error('Simulation error:', err)
    } finally {
      setSimulating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'text-status-excellent'
      case 'playable':
        return 'text-status-playable'
      case 'limited':
        return 'text-status-limited'
      default:
        return 'text-status-not-recommended'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-status-excellent/10 border-status-excellent/30'
      case 'playable':
        return 'bg-status-playable/10 border-status-playable/30'
      case 'limited':
        return 'bg-status-limited/10 border-status-limited/30'
      default:
        return 'bg-status-not-recommended/10 border-status-not-recommended/30'
    }
  }

  const getCheckIcon = (passed: boolean) => {
    return passed ? (
      <Check size={20} className="text-status-excellent" />
    ) : (
      <AlertCircle size={20} className="text-status-not-recommended" />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
            <p className="mt-4 text-gaming-secondary">Loading simulator…</p>
          </div>
        </div>
      </div>
    )
  }

  const selectedGameData = games.find(g => g.id === selectedGame)

  return (
    <div className="min-h-screen bg-gaming-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-gaming-accent" size={32} />
            <h1 className="text-4xl font-bold text-white">Hardware Simulator</h1>
          </div>
          <p className="text-gaming-secondary">
            Test different hardware configurations and see compatibility reports instantly
          </p>
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

        {/* Component Performance Display Card */}
        {(selectedCpu && selectedGpu && selectedOs) && (
          <div className="mb-8 rounded-2xl border-2 border-gaming-accent/20 bg-gradient-to-br from-gaming-card to-gaming-surface p-6 sm:p-8 shadow-xl hover:border-gaming-accent/40 transition-colors">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-gaming-accent to-purple-600 p-3">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Component Performance</h2>
                <p className="text-xs sm:text-sm text-gaming-secondary mt-1">Your selected hardware configuration</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* CPU Display */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 hover:border-gaming-accent/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu size={16} className="text-gaming-accent" />
                  <span className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider">CPU</span>
                </div>
                <p className={`font-semibold truncate text-sm sm:text-base ${selectedCpu ? 'text-white' : 'text-gaming-secondary'}`}>
                  {selectedCpu || '—'}
                </p>
                {selectedCpu && <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Selected</span>
                </div>}
              </div>

              {/* GPU Display */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 hover:border-gaming-accent/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Gpu size={16} className="text-blue-400" />
                  <span className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider">GPU</span>
                </div>
                <p className={`font-semibold truncate text-sm sm:text-base ${selectedGpu ? 'text-white' : 'text-gaming-secondary'}`}>
                  {selectedGpu || '—'}
                </p>
                {selectedGpu && <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Selected</span>
                </div>}
              </div>

              {/* RAM Display */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 hover:border-gaming-accent/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Database size={16} className="text-cyan-400" />
                  <span className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider">RAM</span>
                </div>
                <p className={`font-semibold text-sm sm:text-base ${selectedRam ? 'text-white' : 'text-gaming-secondary'}`}>
                  {selectedRam ? `${selectedRam} GB` : '—'}
                </p>
                {selectedRam && <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Selected</span>
                </div>}
              </div>

              {/* Storage Display */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 hover:border-gaming-accent/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive size={16} className="text-orange-400" />
                  <span className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider">Storage</span>
                </div>
                <p className={`font-semibold text-sm sm:text-base ${selectedStorage ? 'text-white' : 'text-gaming-secondary'}`}>
                  {selectedStorage ? `${selectedStorage} GB` : '—'}
                </p>
                {selectedStorage && <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Selected</span>
                </div>}
              </div>

              {/* OS Display */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 hover:border-gaming-accent/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor size={16} className="text-rose-400" />
                  <span className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider">OS</span>
                </div>
                <p className={`font-semibold truncate text-sm sm:text-base ${selectedOs ? 'text-white' : 'text-gaming-secondary'}`}>
                  {selectedOs || '—'}
                </p>
                {selectedOs && <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Selected</span>
                </div>}
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] items-stretch max-h-[calc(100vh-280px)]">
          {/* Left Column - Inputs */}
          <div className="space-y-6 overflow-y-auto pr-2">
            {/* Game Selection */}
            <div ref={gameDropdownRef} className="relative w-full">
              <button
                onClick={() => setIsGameOpen(!isGameOpen)}
                className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${
                  isGameOpen
                    ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
                    : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
                }`}
              >
                <span className="truncate">{selectedGameData?.name || 'Choose a game...'}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 text-gaming-accent flex-shrink-0 ${isGameOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isGameOpen && (
                <div className="absolute top-full mt-2 w-full z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm max-h-64 overflow-y-auto">
                  {games.map(game => (
                    <button
                      key={game.id}
                      onClick={() => {
                        setSelectedGame(game.id)
                        setIsGameOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                        selectedGame === game.id
                          ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent'
                          : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedGame === game.id ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                      <span className="truncate">{game.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Game Card */}
            {selectedGameData && (
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-4">
                <div className="flex gap-3">
                  <img
                    src={
                      selectedGameData.image_url?.startsWith('http')
                        ? selectedGameData.image_url
                        : selectedGameData.image_url?.startsWith('/uploads/')
                          ? `${import.meta.env.VITE_API_BASE_URL || window.location.origin}${selectedGameData.image_url}`
                          : 'https://via.placeholder.com/80x120?text=Game'
                    }
                    alt={selectedGameData.name}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm line-clamp-2">{selectedGameData.name}</h3>
                    <p className="text-xs text-gaming-secondary">{selectedGameData.genre}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CPU Selection */}
            <div ref={cpuDropdownRef} className="relative w-full">
              <button
                onClick={() => setIsCpuOpen(!isCpuOpen)}
                className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${
                  isCpuOpen
                    ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
                    : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Cpu size={18} className="text-gaming-accent flex-shrink-0" />
                  <span className="truncate text-sm">{selectedCpu || 'Select CPU...'}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 text-gaming-accent flex-shrink-0 ${isCpuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isCpuOpen && (
                <div className="absolute top-full mt-2 w-full z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm max-h-64 overflow-y-auto">
                  {cpus.map((cpu, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCpu(cpu.name)
                        setIsCpuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${selectedCpu === cpu.name ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent' : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedCpu === cpu.name ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                      <span className="truncate text-sm">{cpu.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GPU Selection */}
            <div ref={gpuDropdownRef} className="relative w-full">
              <button
                onClick={() => setIsGpuOpen(!isGpuOpen)}
                className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${
                  isGpuOpen
                    ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
                    : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Gpu size={18} className="text-blue-400 flex-shrink-0" />
                  <span className="truncate text-sm">{selectedGpu || 'Select GPU...'}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 text-gaming-accent flex-shrink-0 ${isGpuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isGpuOpen && (
                <div className="absolute top-full mt-2 w-full z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm max-h-64 overflow-y-auto">
                  {gpus.map((gpu, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedGpu(gpu.name)
                        setIsGpuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${selectedGpu === gpu.name ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent' : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedGpu === gpu.name ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                      <span className="truncate text-sm">{gpu.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RAM Selection */}
            <div ref={ramDropdownRef} className="relative w-full">
              <button
                onClick={() => setIsRamOpen(!isRamOpen)}
                className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${
                  isRamOpen
                    ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
                    : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Database size={18} className="text-cyan-400 flex-shrink-0" />
                  <span className="truncate text-sm">{selectedRam ? `${selectedRam} GB` : 'Select RAM...'}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 text-gaming-accent flex-shrink-0 ${isRamOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isRamOpen && (
                <div className="absolute top-full mt-2 w-full z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm max-h-64 overflow-y-auto">
                  {rams.map((ram, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedRam(ram.value)
                        setIsRamOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${selectedRam === ram.value ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent' : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedRam === ram.value ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                      <span className="text-sm">{ram.value} GB</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Storage Selection */}
            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-6">
              <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                <HardDrive size={16} className="text-orange-400" />
                Storage: {selectedStorage} GB
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gaming-secondary mt-2">
                <span>0 GB</span>
                <span>10 TB</span>
              </div>
            </div>

            {/* OS Selection */}
            <div ref={osDropdownRef} className="relative w-full">
              <button
                onClick={() => setIsOsOpen(!isOsOpen)}
                className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${
                  isOsOpen
                    ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
                    : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Monitor size={18} className="text-rose-400 flex-shrink-0" />
                  <span className="truncate text-sm">{selectedOs || 'Select OS...'}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 text-gaming-accent flex-shrink-0 ${isOsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOsOpen && (
                <div className="absolute top-full mt-2 w-full z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm max-h-64 overflow-y-auto">
                  {oses.map((os, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOs(os.name)
                        setIsOsOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${selectedOs === os.name ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent' : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedOs === os.name ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                      <span className="truncate text-sm">{os.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Simulate Button */}
            <Button
              onClick={handleSimulate}
              disabled={!selectedGame || !selectedCpu || !selectedGpu || !selectedOs || simulating}
              fullWidth
              size="lg"
              icon={simulating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <Zap size={20} />}
            >
              {simulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>

          {/* Right Column - Results */}
          {result && (
            <div className="space-y-4 overflow-y-auto pr-4 pb-12">
              {/* Compatibility Score */}
              <div className={`rounded-xl border-2 p-5 shadow-xl ${getStatusBg(result.status)} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10"></div>
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gaming-secondary text-xs mb-2 uppercase tracking-wider font-semibold">Compatibility Score</p>
                      <p className={`text-4xl font-black ${getStatusColor(result.status)}`}>{result.compatibility_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gaming-secondary text-xs mb-2 uppercase tracking-wider font-semibold">Status</p>
                      <p className={`text-2xl font-black ${getStatusColor(result.status)} capitalize`}>{result.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Estimates */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-3">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Zap size={16} className="text-gaming-accent" />
                  Estimated Performance
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(result.estimated_fps).map(([setting, fps]) => (
                    <div
                      key={setting}
                      className="rounded-lg border border-gaming-accent/30 bg-gaming-surface p-2 text-center hover:border-gaming-accent/60 transition-all hover:shadow-lg hover:shadow-gaming-accent/20"
                    >
                      <p className="text-gaming-secondary text-xs capitalize mb-0.5 font-semibold uppercase tracking-wider">{setting.replace('_', ' ')}</p>
                      <p className="text-xl font-black text-gaming-accent">{fps}</p>
                      <p className="text-xs text-gaming-secondary mt-0.5">FPS</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Component Verification & Requirements Comparison */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-4">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu size={18} className="text-gaming-accent" />
                  System Requirements Verification
                </h3>
                <div className="grid grid-cols-2 gap-3 h-full">
                  {/* User Specs Column */}
                  <div className="flex flex-col h-full">
                    <p className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider mb-2 px-2">Your System</p>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gaming-accent/10 bg-gaming-surface/50 h-fit">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Cpu size={12} className="text-gaming-accent flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs text-gaming-secondary font-semibold block">CPU</span>
                            <span className="text-xs text-white truncate block">{result.user_specs.cpu}</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getCheckIcon(result.checks.cpu_pass)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gaming-accent/10 bg-gaming-surface/50 h-fit">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Gpu size={12} className="text-blue-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs text-gaming-secondary font-semibold block">GPU</span>
                            <span className="text-xs text-white truncate block">{result.user_specs.gpu}</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getCheckIcon(result.checks.gpu_pass)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gaming-accent/10 bg-gaming-surface/50 h-fit">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Database size={12} className="text-cyan-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs text-gaming-secondary font-semibold block">RAM</span>
                            <span className="text-xs text-white block">{result.user_specs.ram_gb} GB</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getCheckIcon(result.checks.ram_pass)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gaming-accent/10 bg-gaming-surface/50 h-fit">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <HardDrive size={12} className="text-orange-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs text-gaming-secondary font-semibold block">Storage</span>
                            <span className="text-xs text-white block">{result.user_specs.storage_gb} GB</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getCheckIcon(result.checks.storage_pass)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gaming-accent/10 bg-gaming-surface/50 h-fit">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Monitor size={12} className="text-rose-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs text-gaming-secondary font-semibold block">OS</span>
                            <span className="text-xs text-white truncate block">{result.user_specs.operating_system || result.minimum_requirements.operating_system}</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {getCheckIcon(result.checks.os_pass)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Minimum Requirements Column */}
                  <div className="flex flex-col h-full">
                    <p className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider mb-2 px-2">Minimum Required</p>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 h-fit">
                        <Cpu size={12} className="text-gaming-accent flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gaming-secondary uppercase font-semibold">CPU</p>
                          <p className="text-xs text-white truncate">{result.minimum_requirements.cpu}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 h-fit">
                        <Gpu size={12} className="text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gaming-secondary uppercase font-semibold">GPU</p>
                          <p className="text-xs text-white truncate">{result.minimum_requirements.gpu}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 h-fit">
                        <Database size={12} className="text-cyan-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gaming-secondary uppercase font-semibold">RAM</p>
                          <p className="text-xs text-white">{result.minimum_requirements.ram_gb} GB</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 h-fit">
                        <HardDrive size={12} className="text-orange-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gaming-secondary uppercase font-semibold">Storage</p>
                          <p className="text-xs text-white">{result.minimum_requirements.storage_gb} GB</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gaming-surface/50 border border-gaming-accent/10 h-fit">
                        <Monitor size={12} className="text-rose-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gaming-secondary uppercase font-semibold">OS</p>
                          <p className="text-xs text-white truncate">{result.minimum_requirements.operating_system || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && (
            <div>
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
                <Zap size={48} className="text-gaming-accent/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Simulation Yet</h3>
                <p className="text-gaming-secondary max-w-md mx-auto">
                  Select a game and hardware components, then click "Run Simulation" to see compatibility analysis and performance estimates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
