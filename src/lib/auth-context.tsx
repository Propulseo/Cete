"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Profile } from "@/types";
import { getUser, login as authLogin, logout as authLogout } from "./auth";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUser(await getUser());
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Resynchronise à chaque changement de session (login, logout, refresh token).
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Différé : ne pas appeler d'autres méthodes supabase dans le callback (deadlock).
      setTimeout(() => {
        refresh();
      }, 0);
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const u = await authLogin(email, password);
    if (u) {
      setUser(u);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
