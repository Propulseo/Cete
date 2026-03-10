/** Supabase table: profiles (extension de auth.users) */
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
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
