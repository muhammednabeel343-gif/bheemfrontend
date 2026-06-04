import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import GameLibraryPage from "./pages/GameLibraryPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CompatibilityPage from "./pages/CompatibilityPage";
import SystemSimulatorPage from "./pages/SystemSimulatorPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CPUPage from "./pages/admin/CPUPage";
import GPUPage from "./pages/admin/GPUPage";
import RAMPage from "./pages/admin/RAMPage";
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
     <Route path="/" element={<Navigate to="/login" replace />} />

<Route
  path="/library"
  element={
    <ProtectedRoute>
      <GameLibraryPage />
    </ProtectedRoute>
  }
/>
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

<Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/simulator" element={<ProtectedRoute><SystemSimulatorPage /></ProtectedRoute>} />
      <Route path="/compatibility/:gameId" element={<CompatibilityPage />} />

      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="cpus" element={<CPUPage />} />
        <Route path="gpus" element={<GPUPage />} />
        <Route path="rams" element={<RAMPage />} />
        <Route path="games" element={<AdminGamesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;