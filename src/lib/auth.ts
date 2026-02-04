import { AuthUser, DEMO_CREDENTIALS, ADMIN_CREDENTIALS } from "@/types";

const AUTH_KEY = "cete_auth_user";

export function login(email: string, password: string): AuthUser | null {
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    const user: AuthUser = {
      email: DEMO_CREDENTIALS.email,
      name: "Jean Dupont",
      role: "client",
      company: "Electricité Pro SA",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    return user;
  }

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const user: AuthUser = {
      email: ADMIN_CREDENTIALS.email,
      name: "Administrateur CETé",
      role: "admin",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    return user;
  }

  return null;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === "admin";
}

export function isClient(): boolean {
  const user = getUser();
  return user?.role === "client";
}
