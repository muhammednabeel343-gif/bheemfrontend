import AppRoutes from './AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import Navigation from './components/Navigation/Navigation'
import { useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation()

  const hideNavigation =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gaming-bg text-white">
      {!hideNavigation && <Navigation />}
      <AppRoutes />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AdminAuthProvider>
          <AppContent />
        </AdminAuthProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App