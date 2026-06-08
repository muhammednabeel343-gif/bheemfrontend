import { useEffect, useState, useMemo, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../../services/gameService'
import { getSystemScan, simulateCompatibility } from '../../services/systemService'
import type { GameSummary, SystemScan, CompatibilityReport } from '../../types/game'
import SearchBar from '../../components/SearchBar'
import { AlertCircle, Zap, Check, X, ChevronDown, Filter, Cpu, Gpu, Database, HardDrive, Monitor } from 'lucide-react'

interface GameWithCompatibility extends GameSummary {
  compatibility?: number
}

export default function CompatibleGames() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [games, setGames] = useState<GameWithCompatibility[]>([])
  const [userSystem, setUserSystem] = useState<SystemScan | null>(null)
  const [systemNotConfigured, setSystemNotConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [isGenreOpen, setIsGenreOpen] = useState(false)
  const genreDropdownRef = useRef<HTMLDivElement>(null)
  const [selectedGame, setSelectedGame] = useState<GameWithCompatibility | null>(null)
  const [compatibilityReport, setCompatibilityReport] = useState<CompatibilityReport | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const pageSize = 20

  // Load user's system and all games
  useEffect(() => {
    const loadData = async () => {
      if (!token) return

      try {
        setLoading(true)
        setError('')
        setSystemNotConfigured(false)

        // Get user's system
        const system = await getSystemScan(token)
        setUserSystem(system)

        // Get all games (max 100 per request - backend limit)
        const response = await getGames(token, '', '', 1, 100)
        setGames(response.games || [])
      } catch (err: any) {
        // If no system found, show setup message
        if (err.message?.includes('No system') || err.status === 404) {
          setSystemNotConfigured(true)
        } else {
          setError(err.message || 'Failed to load games')
        }
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  // Handle Check button click to fetch compatibility report
  const handleCheckGame = async (game: GameWithCompatibility) => {
    if (!token || !userSystem) return

    try {
      setModalLoading(true)
      setSelectedGame(game)

      const report = await simulateCompatibility(token, {
        game_id: game.id,
        cpu: userSystem.cpu,
        gpu: userSystem.gpu,
        ram_gb: userSystem.ram_gb,
        storage_gb: userSystem.storage_gb,
        operating_system: userSystem.operating_system || 'Windows',
      })

      setCompatibilityReport(report)
    } catch (err: any) {
      console.error('Error fetching compatibility report:', err)
      setError(err.message || 'Failed to load compatibility report')
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedGame(null)
    setCompatibilityReport(null)
  }

  // Get unique genres from games
  const allGenres = useMemo(() => {
    const genres = new Set<string>()
    games.forEach((game) => {
      if (game.genre) {
        game.genre.split(',').forEach((g) => genres.add(g.trim()))
      }
    })
    return Array.from(genres).sort()
  }, [games])

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = [...games]

    // Apply search
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(searchLower)
      )
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((game) => {
        if (!game.genre) return false
        const gameGenres = game.genre.split(',').map((g) => g.trim())
        return selectedGenres.some((g) => gameGenres.includes(g))
      })
    }

    // Sort by compatibility descending
    filtered.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))

    return filtered
  }, [games, search, selectedGenres])

  // Paginate
  const totalPages = Math.ceil(filteredGames.length / pageSize)
  const paginatedGames = filteredGames.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [search, selectedGenres])

  // Handle click outside genre dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle click outside genre dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
            <p className="mt-4 text-gaming-secondary">Loading compatible games…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* NO SYSTEM SPECS MESSAGE */}
        {systemNotConfigured ? (
          <div className="mt-12">
            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
              <Zap size={64} className="text-gaming-accent/50 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Add Your System Specs
              </h2>
              <p className="text-lg text-gaming-secondary mb-8 max-w-2xl mx-auto">
                To see compatible games and get personalized compatibility scores, please configure your PC specifications first.
              </p>
              <button
                onClick={() => navigate('/my-system')}
                className="px-8 py-3 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 text-white font-semibold transition-all duration-300 shadow-glow hover:shadow-2xl"
              >
                Configure System Specs
              </button>
            </div>
          </div>
        ) : (
          <>
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

            {/* Header with title and filters */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-3">
                <Zap className="text-gaming-accent" size={32} />
                <div>
                  <h1 className="text-4xl font-bold text-white">Compatible Games</h1>
                  <p className="text-sm text-gaming-secondary">Optimized for your system</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                <div className="w-full sm:w-auto max-w-md">
                  <SearchBar
                    value={search}
                    onSearch={(value) => {
                      setSearch(value)
                      setPage(1)
                    }}
                    placeholder="Search games..."
                  />
                </div>

                {/* Genre Filter Dropdown */}
                {allGenres.length > 0 && (
                  <div ref={genreDropdownRef} className="relative w-full sm:w-auto">
                    <button
                      onClick={() => setIsGenreOpen(!isGenreOpen)}
                      className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-300 backdrop-blur-sm font-medium text-sm ${
                        isGenreOpen
                          ? 'border-gaming-accent/60 bg-gaming-card/80 shadow-lg shadow-gaming-accent/30 text-gaming-accent'
                          : 'border-gaming-accent/30 bg-gaming-card/50 hover:border-gaming-accent/50 text-white hover:text-gaming-accent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gaming-accent" />
                        <span>{selectedGenres.length > 0 ? `${selectedGenres.length} Selected` : 'All Genres'}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 text-gaming-accent ${isGenreOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isGenreOpen && (
                      <div className="absolute top-full mt-2 w-full min-w-max z-50 rounded-lg border border-gaming-accent/40 bg-gaming-card shadow-2xl shadow-gaming-accent/30 overflow-hidden backdrop-blur-sm">
                        <button
                          onClick={() => {
                            setSelectedGenres([])
                            setIsGenreOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                            selectedGenres.length === 0
                              ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent'
                              : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${selectedGenres.length === 0 ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                          All Genres
                        </button>

                        {allGenres.map((genre) => (
                          <button
                            key={genre}
                            onClick={() => {
                              setSelectedGenres(
                                selectedGenres.includes(genre)
                                  ? selectedGenres.filter((g) => g !== genre)
                                  : [...selectedGenres, genre]
                              )
                              setPage(1)
                            }}
                            className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                              selectedGenres.includes(genre)
                                ? 'bg-gaming-accent/30 text-gaming-accent font-semibold border-l-2 border-gaming-accent'
                                : 'text-gaming-secondary hover:bg-gaming-surface/50 hover:text-white'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${selectedGenres.includes(genre) ? 'bg-gaming-accent' : 'bg-gaming-accent/20'}`}></span>
                            {genre}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length === 0 ? (
              <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-12 text-center">
                <Zap size={48} className="text-gaming-accent/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
                <p className="text-gaming-secondary">
                  {search || selectedGenres.length > 0 ? 'Try adjusting your filters or search query' : 'No games available'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {paginatedGames.map((game) => (
                    <div
                      key={game.id}
                      className="group relative overflow-hidden rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm hover:border-gaming-accent/50 transition-all duration-300 hover:shadow-glow transform hover:scale-105 aspect-[2/3] cursor-pointer"
                    >
                      {/* Image Container */}
                      <div className="absolute inset-0 overflow-hidden bg-gaming-surface">
                        <img
                          src={game.image_url || '/placeholder-game.jpg'}
                          alt={game.name}
                          className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                        {/* Title and Genre */}
                        <div>
                          <h3 className="font-bold text-base text-white line-clamp-2 group-hover:text-gaming-accent transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-xs text-gaming-secondary mt-1">
                            {game.genre || 'Unknown Genre'}
                          </p>
                        </div>

                        {/* Check Button */}
                        <button
                          onClick={() => handleCheckGame(game)}
                          className="w-full px-4 py-2 rounded-lg bg-gaming-accent hover:bg-gaming-accent/80 text-white font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 border-t border-gaming-accent/10 pt-3"
                        >
                          <Check size={16} />
                          Check
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gaming-accent/20 text-gaming-secondary hover:bg-gaming-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                            p === page
                              ? 'bg-gaming-accent text-white'
                              : 'border border-gaming-accent/20 text-gaming-secondary hover:bg-gaming-surface'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gaming-accent/20 text-gaming-secondary hover:bg-gaming-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}

                <p className="text-center text-gaming-secondary text-sm mt-6">
                  Showing {paginatedGames.length} of {filteredGames.length} games
                  {search && ` matching "${search}"`}
                  {selectedGenres.length > 0 && ` in ${selectedGenres.join(', ')}`}
                </p>
              </>
            )}
          </>
        )}

        {/* Compatibility Report Modal */}
        {selectedGame && compatibilityReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-xl border border-gaming-accent/20 bg-gaming-card shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gaming-surface border-b border-gaming-accent/20 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{selectedGame.name}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gaming-accent/20 text-gaming-secondary hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {modalLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gaming-accent border-t-transparent"></div>
                  <p className="mt-4 text-gaming-secondary">Loading compatibility report...</p>
                </div>
              ) : (
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Compatibility Score Header */}
                  <div className="rounded-2xl border-2 border-gaming-accent/20 bg-gradient-to-br from-gaming-card to-gaming-surface p-8 hover:border-gaming-accent/40 transition-colors">
                    <div className="grid grid-cols-2 gap-8 items-center">
                      <div>
                        <p className="text-gaming-secondary text-xs font-semibold uppercase tracking-wider mb-2">Compatibility Score</p>
                        <p className={`text-5xl font-bold ${
                          compatibilityReport.status === 'Excellent'
                            ? 'text-status-excellent'
                            : compatibilityReport.status === 'Playable'
                            ? 'text-status-playable'
                            : compatibilityReport.status === 'Limited'
                            ? 'text-status-limited'
                            : 'text-status-not-recommended'
                        }`}>
                          {compatibilityReport.compatibility_percentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gaming-secondary text-xs font-semibold uppercase tracking-wider mb-2">Status</p>
                        <p className={`text-4xl font-bold ${
                          compatibilityReport.status === 'Excellent'
                            ? 'text-status-excellent'
                            : compatibilityReport.status === 'Playable'
                            ? 'text-status-playable'
                            : compatibilityReport.status === 'Limited'
                            ? 'text-status-limited'
                            : 'text-status-not-recommended'
                        }`}>
                          {compatibilityReport.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Performance */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-lg bg-gradient-to-br from-gaming-accent to-purple-600 p-3">
                        <Zap size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Estimated Performance</h3>
                        <p className="text-xs sm:text-sm text-gaming-secondary mt-1">FPS estimates at different settings</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Low', fps: compatibilityReport.estimated_fps?.low },
                        { label: 'Medium', fps: compatibilityReport.estimated_fps?.medium },
                        { label: 'High', fps: compatibilityReport.estimated_fps?.high },
                        { label: 'Ultra', fps: compatibilityReport.estimated_fps?.ultra },
                      ].map((setting) => (
                        <div key={setting.label} className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-4 text-center hover:border-gaming-accent/40 transition-colors">
                          <p className="text-gaming-secondary text-xs font-semibold uppercase tracking-wider mb-3">{setting.label}</p>
                          <p className="text-3xl font-bold text-white">{setting.fps || '—'}</p>
                          <p className="text-xs text-gaming-secondary/70 mt-2">FPS</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Requirements Verification */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-3">
                        <Check size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">System Requirements Verification</h3>
                        <p className="text-xs sm:text-sm text-gaming-secondary mt-1">Your system vs minimum requirements</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Your System */}
                      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-6 hover:border-gaming-accent/40 transition-colors">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Your System</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Cpu size={18} className="text-gaming-accent flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gaming-secondary">CPU</p>
                              <p className="text-sm text-white font-medium truncate">{userSystem?.cpu || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Gpu size={18} className="text-blue-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gaming-secondary">GPU</p>
                              <p className="text-sm text-white font-medium truncate">{userSystem?.gpu || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Database size={18} className="text-cyan-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gaming-secondary">RAM</p>
                              <p className="text-sm text-white font-medium">{userSystem?.ram_gb || '—'} GB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <HardDrive size={18} className="text-orange-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gaming-secondary">Storage</p>
                              <p className="text-sm text-white font-medium">{userSystem?.storage_gb || '—'} GB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Monitor size={18} className="text-rose-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gaming-secondary">OS</p>
                              <p className="text-sm text-white font-medium">{userSystem?.operating_system || '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Minimum Requirements */}
                      <div className="rounded-xl border border-gaming-accent/20 bg-gaming-surface/50 p-6 hover:border-gaming-accent/40 transition-colors">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Minimum Required</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Cpu size={18} className="text-gaming-accent flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gaming-secondary">CPU</p>
                              <p className="text-sm text-white font-medium truncate">{compatibilityReport.minimum_requirements?.cpu || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Gpu size={18} className="text-blue-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gaming-secondary">GPU</p>
                              <p className="text-sm text-white font-medium truncate">{compatibilityReport.minimum_requirements?.gpu || '—'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Database size={18} className="text-cyan-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gaming-secondary">RAM</p>
                              <p className="text-sm text-white font-medium">{compatibilityReport.minimum_requirements?.ram_gb || '—'} GB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <HardDrive size={18} className="text-orange-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gaming-secondary">Storage</p>
                              <p className="text-sm text-white font-medium">{compatibilityReport.minimum_requirements?.storage_gb || '—'} GB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Monitor size={18} className="text-rose-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gaming-secondary">OS</p>
                              <p className="text-sm text-white font-medium">{compatibilityReport.minimum_requirements?.operating_system || '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Component Verification Checks */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Component Verification</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { name: 'CPU', pass: compatibilityReport.checks?.cpu_pass, icon: Cpu },
                        { name: 'GPU', pass: compatibilityReport.checks?.gpu_pass, icon: Gpu },
                        { name: 'RAM', pass: compatibilityReport.checks?.ram_pass, icon: Database },
                        { name: 'Storage', pass: compatibilityReport.checks?.storage_pass, icon: HardDrive },
                        { name: 'Operating System', pass: compatibilityReport.checks?.os_pass, icon: Monitor },
                      ].map((check) => {
                        const Icon = check.icon
                        return (
                          <div
                            key={check.name}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors ${
                              check.pass
                                ? 'border-status-excellent/30 bg-status-excellent/10'
                                : 'border-status-not-recommended/30 bg-status-not-recommended/10'
                            }`}
                          >
                            <Icon size={18} className={check.pass ? 'text-status-excellent' : 'text-status-not-recommended'} />
                            <span className={`flex-1 font-medium ${check.pass ? 'text-status-excellent' : 'text-status-not-recommended'}`}>
                              {check.name}
                            </span>
                            {check.pass ? (
                              <Check size={18} className="text-status-excellent" />
                            ) : (
                              <X size={18} className="text-status-not-recommended" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gaming-accent to-purple-600 hover:from-gaming-accent-hover hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-gaming-accent/30 active:scale-95"
                  >
                    Close Report
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
