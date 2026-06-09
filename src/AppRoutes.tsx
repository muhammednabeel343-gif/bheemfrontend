import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import GameLibraryPage from "./pages/GameLibraryPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CompatibilityPage from "./pages/CompatibilityPage";
import SystemSimulatorPage from "./pages/SystemSimulatorPage";
import MySystem from "./pages/MySystem/MySystem";
import CompatibleGames from "./pages/CompatibleGames/CompatibleGames";
import GameDetails from "./pages/GameDetails/GameDetails";
import Simulator from "./pages/Simulator/Simulator";
import Profile from "./pages/Profile/Profile";
import HomePage from "./pages/HomePage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CPUPage from "./pages/admin/CPUPage";
import GPUPage from "./pages/admin/GPUPage";
import RAMPage from "./pages/admin/RAMPage";
import OSPage from "./pages/admin/OSPage";
import AdminGamesPage from "./pages/admin/AdminGamesPage";
import { useAdminAuth } from "./contexts/AdminAuthContext";

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAdminAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!token) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><GameLibraryPage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/system" element={<ProtectedRoute><MySystem /></ProtectedRoute>} />
      <Route path="/compatible-games" element={<ProtectedRoute><CompatibleGames /></ProtectedRoute>} />
      <Route path="/games/:gameId" element={<ProtectedRoute><GameDetails /></ProtectedRoute>} />
      <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
      <Route path="/profile/:userId?" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/compatibility/:gameId" element={<ProtectedRoute><CompatibilityPage /></ProtectedRoute>} />

      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="cpus" element={<CPUPage />} />
        <Route path="gpus" element={<GPUPage />} />
        <Route path="rams" element={<RAMPage />} />
        <Route path="oses" element={<OSPage />} />
        <Route path="games" element={<AdminGamesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;