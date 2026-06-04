import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser, fetchCurrentUser } from "../services/authService";
import type { AuthContextValue, LoginRequest, RegisterRequest, UserProfile, TokenResponse } from "../types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const tokenStorageKey = "bheem_auth_token";
const roleStorageKey = "bheem_auth_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenStorageKey));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(() => localStorage.getItem(roleStorageKey));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      if (token) {
        const storedRole = localStorage.getItem(roleStorageKey);
        if (storedRole === "admin") {
          if (!cancelled) setLoading(false);
        } else {
          try {
            const profile = await fetchCurrentUser(token);
            if (!cancelled) setUser(profile);
          } catch {
            localStorage.removeItem(tokenStorageKey);
            localStorage.removeItem(roleStorageKey);
            if (!cancelled) { setToken(null); setRole(null); }
          }
        }
      }
      if (!cancelled) setLoading(false);
    };
    initialize();
    return () => { cancelled = true; };
  }, [token]);

  const signIn = async (payload: LoginRequest) => {
    const response = await loginUser(payload);
    localStorage.setItem(tokenStorageKey, response.access_token);
    localStorage.setItem(roleStorageKey, response.role || "user");
    setToken(response.access_token);
    setRole(response.role || "user");
    if (response.role === "admin") {
  localStorage.setItem("bheem_admin_token", response.access_token);
  window.location.assign("/admin/dashboard");
  return;
}
    else {
      const profile = await fetchCurrentUser(response.access_token);
      setUser(profile);
      window.location.assign("/");
    }
  };

  const signUp = async (payload: RegisterRequest) => {
    const response = await registerUser(payload);
    localStorage.setItem(tokenStorageKey, response.access_token);
    localStorage.setItem(roleStorageKey, "user");
    setToken(response.access_token);
    setRole("user");
    const profile = await fetchCurrentUser(response.access_token);
    setUser(profile);
    window.location.assign("/");
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(roleStorageKey);
    window.location.assign("/login");
  };

  const value = useMemo(
    () => ({ token, user, loading, role, signIn, signUp, signOut }),
    [token, user, loading, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}