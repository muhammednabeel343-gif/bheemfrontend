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
      const storedRole = localStorage.getItem(roleStorageKey);
      if (storedRole === "admin") {
        localStorage.removeItem(tokenStorageKey);
        if (!cancelled) {
          setToken(null);
          setRole("admin");
          setLoading(false);
        }
        return;
      }

      if (token) {
        try {
          const profile = await fetchCurrentUser(token);
          if (!cancelled) setUser(profile);
        } catch {
          localStorage.removeItem(tokenStorageKey);
          localStorage.removeItem(roleStorageKey);
          if (!cancelled) { setToken(null); setRole(null); }
        }
      }
      if (!cancelled) setLoading(false);
    };
    initialize();
    return () => { cancelled = true; };
  }, [token]);

  const signIn = async (payload: LoginRequest) => {
    const response = await loginUser(payload);

    if (response.role === "admin") {
      localStorage.removeItem(tokenStorageKey);
      localStorage.setItem(roleStorageKey, "admin");
      localStorage.setItem("bheem_admin_token", response.access_token);
      setToken(null);
      setRole("admin");
      return "admin";
    }

    localStorage.removeItem("bheem_admin_token");
    localStorage.setItem(tokenStorageKey, response.access_token);
    localStorage.setItem(roleStorageKey, response.role || "user");
    setToken(response.access_token);
    setRole(response.role || "user");
    const profile = await fetchCurrentUser(response.access_token);
    setUser(profile);
    return "user";
  };

  const signUp = async (payload: RegisterRequest) => {
    const response = await registerUser(payload);
    localStorage.removeItem("bheem_admin_token");
    localStorage.setItem(tokenStorageKey, response.access_token);
    localStorage.setItem(roleStorageKey, "user");
    setToken(response.access_token);
    setRole("user");
    const profile = await fetchCurrentUser(response.access_token);
    setUser(profile);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(roleStorageKey);
    localStorage.removeItem("bheem_admin_token");
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