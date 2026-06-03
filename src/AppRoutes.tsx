import { Navigate, Route, Routes } from 'react-router-dom'
import GameLibraryPage from './pages/GameLibraryPage'
import FavoritesPage from './pages/FavoritesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import CompatibilityPage from './pages/CompatibilityPage'
import SystemSimulatorPage from './pages/SystemSimulatorPage'

function AppRoutes() {
  return (
    <Routes>
       <Route path="/" element={<ProtectedRoute><GameLibraryPage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/compatibility/:gameId" element={<CompatibilityPage />} />
      <Route path="/simulator" element={<SystemSimulatorPage />} />
     </Routes>
  )
}

export default AppRoutes
