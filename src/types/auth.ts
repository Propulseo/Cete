/** Supabase table: profiles (extension de auth.users) */
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  /** FK vers `Client` (distinct de l'id auth). Requis en pratique pour `role === "client"`. */
  clientId?: string;
  company?: string;
  phone?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
