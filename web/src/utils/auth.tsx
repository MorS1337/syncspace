import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "@utils/api";

type User = { id: number; name: string; email?: string | null };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<User>("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(name: string, password: string) {
    const u = await api<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ name, password })
    });
    setUser(u);
  }

  async function register(name: string, password: string) {
    const u = await api<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, password })
    });
    setUser(u);
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthProvider missing");
  }
  return ctx;
}

