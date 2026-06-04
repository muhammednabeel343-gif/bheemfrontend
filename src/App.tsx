import AppRoutes from './AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation()

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/admin')

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
        <AdminAuthProvider>
          <AppContent />
        </AdminAuthProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App