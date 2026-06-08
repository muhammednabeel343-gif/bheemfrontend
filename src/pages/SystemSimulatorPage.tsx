import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Listbox } from '@headlessui/react'
import { getGames } from '../services/gameService'
import { useNavigate } from 'react-router-dom'
import { simulateCompatibility, getCpuOptions, getGpuOptions, getRamOptions, getStorageOptions, getOsOptions } from '../services/systemService'
import { Cpu, Gpu, HardDrive, Gamepad2, Monitor, ChevronDown, Check, Zap, Database, Settings } from 'lucide-react'

function SystemSimulatorPage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [cpus, setCpus] = useState<any[]>([])
  const [gpus, setGpus] = useState<any[]>([])
  const [rams, setRams] = useState<any[]>([])
  const [storages, setStorages] = useState<any[]>([])
  const [oses, setOses] = useState<any[]>([])
  const [report, setReport] = useState<any>(null)

  const [cpu, setCpu] = useState('')
  const [gpu, setGpu] = useState('')
  const [ram, setRam] = useState<number | null>(null)
  const [storage, setStorage] = useState(250)
  const [os, setOs] = useState('')

  const [games, setGames] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState<any>(null)

  useEffect(() => {
    if (!token) return

    const loadHardware = async () => {
      try {
        const [cpuData, gpuData, ramData, storageData, osData] = await Promise.all([
          getCpuOptions(token),
          getGpuOptions(token),
          getRamOptions(token),
          getStorageOptions(token),
          getOsOptions(token),
        ])

        setCpus(cpuData)
        setGpus(gpuData)
        setRams(ramData)
        setStorages(storageData)
        setOses(osData)
        const gamesData = await getGames(token)
        setGames(gamesData.games)
      } catch (error) {
        console.error(error)
      }
    }

    loadHardware()
  }, [token])

  const scanSimulator = async () => {
    if (!cpu) {
      alert('Please select a CPU')
      return
    }

    if (!gpu) {
      alert('Please select a GPU')
      return
    }

    if (!ram) {
      alert('Please select RAM')
      return
    }

    if (!os) {
      alert('Please select an OS')
      return
    }

    if (!selectedGame) {
      alert('Please select a game')
      return
    }

    try {
      const result = await simulateCompatibility(
        token!,
        {
          game_id: selectedGame.id,
          cpu,
          gpu,
          ram_gb: ram,
          storage_gb: storage,
          operating_system: os,
        }
      )

      setReport(result)

      navigate(
        `/compatibility/${selectedGame.id}`,
        {
          state: {
            report: result,
            game: selectedGame,
          },
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-bg via-gaming-surface to-gaming-bg px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">PC Compatibility Simulator</h1>
            <p className="text-gaming-secondary text-sm">Test game compatibility with custom hardware configurations</p>
          </div>
          <button
            type="button"
            onClick={scanSimulator}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-gaming-accent to-purple-600 px-6 sm:px-8 py-3 text-sm font-semibold text-white hover:from-gaming-accent-hover hover:to-purple-500 transition-all shadow-lg shadow-gaming-accent/30 active:scale-95 whitespace-nowrap"
          >
            Scan Compatibility
          </button>
        </div>

        {/* Component Performance Display Card */}
        {(cpu || gpu || ram || storage || os) && (
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
                <p className={`font-semibold truncate text-sm sm:text-base ${cpu ? 'text-white' : 'text-gaming-secondary'}`}>
                  {cpu || '—'}
                </p>
                {cpu && <div className="mt-2 flex items-center gap-1">
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
                <p className={`font-semibold truncate text-sm sm:text-base ${gpu ? 'text-white' : 'text-gaming-secondary'}`}>
                  {gpu || '—'}
                </p>
                {gpu && <div className="mt-2 flex items-center gap-1">
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
                <p className={`font-semibold text-sm sm:text-base ${ram ? 'text-white' : 'text-gaming-secondary'}`}>
                  {ram ? `${ram} GB` : '—'}
                </p>
                {ram && <div className="mt-2 flex items-center gap-1">
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
                <p className="font-semibold text-sm sm:text-base text-white">
                  {storage} GB
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Set</span>
                </div>
              </div>

              {/* OS Display */}
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 hover:border-gaming-accent/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor size={16} className="text-rose-400" />
                  <span className="text-xs font-semibold text-gaming-secondary uppercase tracking-wider">OS</span>
                </div>
                <p className={`font-semibold truncate text-sm sm:text-base ${os ? 'text-white' : 'text-gaming-secondary'}`}>
                  {os || '—'}
                </p>
                {os && <div className="mt-2 flex items-center gap-1">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Selected</span>
                </div>}
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* PC Specs Section */}
          <div className="lg:col-span-2 rounded-2xl border-2 border-gaming-accent/20 bg-gradient-to-br from-gaming-card to-gaming-surface backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:border-gaming-accent/40 transition-colors">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-gaming-accent to-purple-600 p-3">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Custom PC Specs</h2>
                <p className="text-sm text-gaming-secondary mt-1">Configure your system hardware</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* CPU Dropdown */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Cpu size={16} className="text-gaming-accent" />
                  Processor
                </label>
                <Listbox value={cpu} onChange={setCpu}>
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 px-4 py-3 text-left font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-gaming-accent focus:border-gaming-accent">
                      <div className="flex items-center justify-between">
                        <span className={cpu ? 'text-white' : 'text-gaming-secondary'}>
                          {cpu || 'Select CPU...'}
                        </span>
                        <ChevronDown size={18} className={`text-gaming-accent transition-transform duration-300 ${cpu ? 'opacity-100' : 'opacity-60'}`} />
                      </div>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-lg border-2 border-gaming-accent/30 bg-gaming-card shadow-2xl shadow-gaming-accent/20">
                      {cpus.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gaming-secondary">
                          <p className="text-sm font-medium">No CPUs available</p>
                          <p className="text-xs mt-1 opacity-70">Add CPUs in admin panel</p>
                        </div>
                      ) : (
                        cpus.map((item, idx) => (
                          <Listbox.Option
                            key={`${item.name}-${idx}`}
                            value={item.name}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 px-4 transition-colors flex items-center gap-3 ${
                                active ? 'bg-gaming-accent/30 text-white' : 'text-gaming-secondary hover:bg-gaming-surface/50'
                              } ${cpu === item.name ? 'bg-gaming-accent/50 text-white font-semibold' : ''}`
                            }
                          >
                            {cpu === item.name && <Check size={18} className="text-gaming-accent flex-shrink-0" />}
                            <span className="block truncate">{item.name}</span>
                          </Listbox.Option>
                        ))
                      )}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* GPU Dropdown */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Gpu size={16} className="text-blue-400" />
                  Graphics Card
                </label>
                <Listbox value={gpu} onChange={setGpu}>
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 px-4 py-3 text-left font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <div className="flex items-center justify-between">
                        <span className={gpu ? 'text-white' : 'text-gaming-secondary'}>
                          {gpu || 'Select GPU...'}
                        </span>
                        <ChevronDown size={18} className={`text-blue-400 transition-transform duration-300 ${gpu ? 'opacity-100' : 'opacity-60'}`} />
                      </div>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-lg border-2 border-gaming-accent/30 bg-gaming-card shadow-2xl shadow-gaming-accent/20">
                      {gpus.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gaming-secondary">
                          <p className="text-sm font-medium">No GPUs available</p>
                          <p className="text-xs mt-1 opacity-70">Add GPUs in admin panel</p>
                        </div>
                      ) : (
                        gpus.map((item, idx) => (
                          <Listbox.Option
                            key={`${item.name}-${idx}`}
                            value={item.name}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 px-4 transition-colors flex items-center gap-3 ${
                                active ? 'bg-gaming-accent/30 text-white' : 'text-gaming-secondary hover:bg-gaming-surface/50'
                              } ${gpu === item.name ? 'bg-gaming-accent/50 text-white font-semibold' : ''}`
                            }
                          >
                            {gpu === item.name && <Check size={18} className="text-gaming-accent flex-shrink-0" />}
                            <span className="block truncate">{item.name}</span>
                          </Listbox.Option>
                        ))
                      )}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* RAM Dropdown */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Database size={16} className="text-cyan-400" />
                  Memory
                </label>
                <Listbox value={ram} onChange={setRam}>
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 px-4 py-3 text-left font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                      <div className="flex items-center justify-between">
                        <span className={ram ? 'text-white' : 'text-gaming-secondary'}>
                          {ram ? `${ram} GB RAM` : 'Select RAM...'}
                        </span>
                        <ChevronDown size={18} className={`text-cyan-400 transition-transform duration-300 ${ram ? 'opacity-100' : 'opacity-60'}`} />
                      </div>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-lg border-2 border-gaming-accent/30 bg-gaming-card shadow-2xl shadow-gaming-accent/20">
                      {rams.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gaming-secondary">
                          <p className="text-sm font-medium">No RAM options available</p>
                          <p className="text-xs mt-1 opacity-70">Add RAM in admin panel</p>
                        </div>
                      ) : (
                        rams.map((item, idx) => (
                          <Listbox.Option
                            key={`${item.value}-${idx}`}
                            value={item.value}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 px-4 transition-colors flex items-center gap-3 ${
                                active ? 'bg-gaming-accent/30 text-white' : 'text-gaming-secondary hover:bg-gaming-surface/50'
                              } ${ram === item.value ? 'bg-gaming-accent/50 text-white font-semibold' : ''}`
                            }
                          >
                            {ram === item.value && <Check size={18} className="text-gaming-accent flex-shrink-0" />}
                            <span className="block truncate">{item.label || `${item.value} GB`}</span>
                          </Listbox.Option>
                        ))
                      )}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* OS Dropdown */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Monitor size={16} className="text-rose-400" />
                  Operating System
                </label>
                <Listbox value={os} onChange={setOs}>
                  <div className="relative">
                    <Listbox.Button className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 px-4 py-3 text-left font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500">
                      <div className="flex items-center justify-between">
                        <span className={os ? 'text-white' : 'text-gaming-secondary'}>
                          {os || 'Select OS...'}
                        </span>
                        <ChevronDown size={18} className={`text-rose-400 transition-transform duration-300 ${os ? 'opacity-100' : 'opacity-60'}`} />
                      </div>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-lg border-2 border-gaming-accent/30 bg-gaming-card shadow-2xl shadow-gaming-accent/20">
                      {oses.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gaming-secondary">
                          <p className="text-sm font-medium">No OS options available</p>
                          <p className="text-xs mt-1 opacity-70">Add OS in admin panel</p>
                        </div>
                      ) : (
                        oses.map((item, idx) => (
                          <Listbox.Option
                            key={`${item.name}-${idx}`}
                            value={item.name}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 px-4 transition-colors flex items-center gap-3 ${
                                active ? 'bg-gaming-accent/30 text-white' : 'text-gaming-secondary hover:bg-gaming-surface/50'
                              } ${os === item.name ? 'bg-gaming-accent/50 text-white font-semibold' : ''}`
                            }
                          >
                            {os === item.name && <Check size={18} className="text-gaming-accent flex-shrink-0" />}
                            <span className="block truncate">{item.name}</span>
                          </Listbox.Option>
                        ))
                      )}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* Storage Slider */}
              <div>
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wide">
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HardDrive size={16} className="text-orange-400" />
                      Storage
                    </span>
                    <span className="text-gaming-accent font-bold text-base">{storage} GB</span>
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={storage}
                  onChange={(e) => setStorage(Number(e.target.value))}
                  className="w-full h-2 bg-gaming-surface rounded-lg appearance-none cursor-pointer accent-gaming-accent"
                  style={{
                    background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${(storage / 500) * 100}%, rgb(15, 23, 42) ${(storage / 500) * 100}%, rgb(15, 23, 42) 100%)`
                  }}
                />
                <div className="mt-3 flex justify-between text-xs text-gaming-secondary font-medium">
                  <span>0 GB</span>
                  <span>250 GB</span>
                  <span>500 GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Selection Section */}
          <div className="rounded-2xl border-2 border-gaming-accent/20 bg-gradient-to-br from-gaming-card to-gaming-surface backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:border-gaming-accent/40 transition-colors">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-amber-600 to-amber-500 p-3">
                <Gamepad2 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Select Game</h2>
                <p className="text-sm text-gaming-secondary mt-1">Test compatibility</p>
              </div>
            </div>

            {games.length === 0 ? (
              <div className="rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface/50 p-6 text-center">
                <p className="text-gaming-secondary font-medium">No games available</p>
                <p className="text-xs text-gaming-secondary/70 mt-2">Add games in admin panel</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <Listbox value={selectedGame} onChange={setSelectedGame}>
                    <div className="relative">
                      <Listbox.Button className="w-full rounded-lg border-2 border-gaming-accent/20 bg-gaming-surface/60 hover:bg-gaming-surface hover:border-gaming-accent/40 px-4 py-3 text-left font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <div className="flex items-center justify-between">
                          <span className={selectedGame ? 'text-white' : 'text-gaming-secondary'}>
                            {selectedGame?.name || 'Select Game...'}
                          </span>
                          <ChevronDown size={18} className={`text-amber-500 transition-transform duration-300 ${selectedGame ? 'opacity-100' : 'opacity-60'}`} />
                        </div>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-lg border-2 border-gaming-accent/30 bg-gaming-card shadow-2xl shadow-gaming-accent/20">
                        {games.map((game) => (
                          <Listbox.Option
                            key={game.id}
                            value={game}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 px-4 transition-colors flex items-center gap-3 ${
                                active ? 'bg-gaming-accent/30 text-white' : 'text-gaming-secondary hover:bg-gaming-surface/50'
                              } ${selectedGame?.id === game.id ? 'bg-gaming-accent/50 text-white font-semibold' : ''}`
                            }
                          >
                            {selectedGame?.id === game.id && <Check size={18} className="text-gaming-accent flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <span className="block truncate font-medium">{game.name}</span>
                              {game.genre && <span className="text-xs text-gaming-secondary/70 block mt-0.5">{game.genre}</span>}
                            </div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {selectedGame && (
                  <div className="mt-6 rounded-lg border-2 border-gaming-accent/20 bg-gradient-to-br from-gaming-surface to-gaming-card p-4 sm:p-5 overflow-hidden hover:border-gaming-accent/40 transition-colors">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={selectedGame.image_url}
                          alt={selectedGame.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x80?text=Game' }}
                          className="h-32 w-24 rounded-lg object-cover bg-gaming-surface border border-gaming-accent/20"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                          {selectedGame.name}
                        </h3>
                        {selectedGame.genre && (
                          <p className="mt-2 text-xs sm:text-sm text-gaming-accent font-semibold">
                            {selectedGame.genre}
                          </p>
                        )}
                        {selectedGame.publisher && (
                          <p className="mt-1 text-xs text-gaming-secondary/70">
                            by {selectedGame.publisher}
                          </p>
                        )}
                        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded bg-gaming-accent/20 border border-gaming-accent/30">
                          <Gamepad2 size={12} className="text-gaming-accent" />
                          <span className="text-xs text-gaming-accent font-semibold">Ready to test</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSimulatorPage