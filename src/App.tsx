import AppRoutes from './AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation()

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App