import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { AdminContextValue, AdminLoginRequest, AdminProfile } from "../types/admin";

const AdminAuthContext = createContext<AdminContextValue | undefined>(undefined);
const adminTokenKey = "bheem_admin_token";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(adminTokenKey));
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      const storedAdmin = localStorage.getItem("bheem_admin_profile");
      if (storedAdmin && token) {
        setAdmin(JSON.parse(storedAdmin) as AdminProfile);
      }
      if (!cancelled) setLoading(false);
    };
    initialize();
    return () => { cancelled = true; };
  }, [token]);

  const signIn = async (payload: AdminLoginRequest) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem(adminTokenKey, data.access_token);
    localStorage.setItem("bheem_admin_profile", JSON.stringify(data.admin));
    setToken(data.access_token);
    setAdmin(data.admin as AdminProfile);
    window.location.assign("/admin/dashboard");
  };

  const signOut = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(adminTokenKey);
    localStorage.removeItem("bheem_admin_profile");
    window.location.assign("/admin/login");
  };

  const value = useMemo(
    () => ({ token, admin, loading, signIn, signOut }),
    [token, admin, loading],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
}