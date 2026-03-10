import type { Profile, AuthCredentials } from "@/types";

const AUTH_KEY = "cete_auth_user";

const DEMO_CREDENTIALS: AuthCredentials = {
  email: "demo@cete.fr",
  password: "Cete2026",
};

const ADMIN_CREDENTIALS: AuthCredentials = {
  email: "admin@cete.fr",
  password: "Admin2026",
};

// TODO Supabase: supabase.auth.signInWithPassword({ email, password })
// puis supabase.from('profiles').select('*').eq('id', user.id).single()
export async function login(email: string, password: string): Promise<Profile | null> {
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    const user: Profile = {
      id: "cli-12345",
      email: DEMO_CREDENTIALS.email,
      name: "Jean Dupont",
      role: "client",
      company: "Electricité Pro SA",
      is_active: true,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    return user;
  }

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const user: Profile = {
      id: "adm-001",
      email: ADMIN_CREDENTIALS.email,
      name: "Administrateur CETé",
      role: "admin",
      is_active: true,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    return user;
  }

  return null;
}

// TODO Supabase: supabase.auth.signOut()
export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

// TODO Supabase: supabase.auth.getUser() + supabase.from('profiles').select('*').eq('id', user.id).single()
export async function getUser(): Promise<Profile | null> {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Profile;
  } catch {
    return null;
  }
}

// TODO Supabase: basé sur supabase.auth.getUser()
export async function isAuthenticated(): Promise<boolean> {
  return (await getUser()) !== null;
}

// TODO Supabase: basé sur le rôle du profil
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === "admin";
}

// TODO Supabase: basé sur le rôle du profil
export async function isClient(): Promise<boolean> {
  const user = await getUser();
  return user?.role === "client";
}
