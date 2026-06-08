import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button'
import { Zap, Gamepad2 } from 'lucide-react'

function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gaming-bg">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Welcome Card */}
        <div className="mb-16 rounded-xl border border-gaming-accent/30 bg-gaming-card/50 backdrop-blur-sm p-8 sm:p-12 hover:border-gaming-accent/50 transition-all duration-300">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                Welcome back, <span className="bg-gradient-to-r from-gaming-accent to-gaming-accent-hover bg-clip-text text-transparent">{user?.username}</span>!
              </h1>
              <p className="text-gaming-secondary text-lg mb-6">
                Ready to discover your next favorite game?
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/library')} size="lg">
                  Browse Games
                </Button>
                <Button variant="secondary" onClick={() => navigate('/system')} size="lg">
                  Check Your System
                </Button>
              </div>
            </div>
            <div className="hidden sm:flex items-center justify-center">
              <div className="text-6xl">🎮</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 hover:border-gaming-accent/40 transition-all duration-300">
              <Zap className="text-gaming-accent mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Instant Compatibility</h3>
              <p className="text-gaming-secondary">Check game compatibility with your system instantly using AI-powered analysis.</p>
            </div>

            <div className="rounded-xl border border-gaming-accent/20 bg-gaming-card/50 backdrop-blur-sm p-8 hover:border-gaming-accent/40 transition-all duration-300">
              <Gamepad2 className="text-gaming-accent mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Game Library</h3>
              <p className="text-gaming-secondary">Browse thousands of games with detailed performance metrics and user reviews.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
