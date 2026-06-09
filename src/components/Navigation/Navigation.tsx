import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../Button/Button'
import GameReadyLogo from '../GameReadyLogo'

function Navigation() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/library', label: 'Game Library' },
    { path: '/system', label: 'My System' },
    { path: '/compatible-games', label: 'Compatible Games' },
    { path: '/simulator', label: 'Simulator' },
    { path: '/profile', label: 'Profile' },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    signOut()
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gaming-accent/20 bg-gaming-bg/95 backdrop-blur-md shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-auto py-3 items-center justify-between">
          {/* Logo Section - Stacked */}
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity flex flex-col items-start"
          >
            <div className="scale-75 origin-left">
              <GameReadyLogo variant="compact" />
            </div>
            <p className="text-xs text-gaming-secondary -mt-2">Measure Your PC. Match Your Games.</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gaming-accent text-white shadow-glow'
                    : 'text-gaming-secondary hover:text-gaming-accent hover:bg-gaming-accent/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gaming-secondary">
                  {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gaming-surface transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gaming-accent" />
            ) : (
              <Menu size={24} className="text-gaming-accent" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slide-in border-t border-gaming-accent/20 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gaming-accent text-white'
                      : 'text-gaming-secondary hover:text-gaming-accent hover:bg-gaming-accent/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <div className="border-t border-gaming-accent/20 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-gaming-secondary mb-2">
                    {user.username}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={handleLogout}
                    icon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
