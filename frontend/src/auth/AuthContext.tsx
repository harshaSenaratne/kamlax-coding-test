import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api, TOKEN_STORAGE_KEY } from "../api/client";
import { LoginInput, User } from "../types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
        setLoading(false);
        return;
      }

      try {
        const session = await api.getCurrentUser();
        if (active) {
          setUser(session.user);
        }
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(input) {
        const session = await api.login(input);
        localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
        setUser(session.user);
      },
      logout() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

