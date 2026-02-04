export interface AuthUser {
  email: string;
  name: string;
  role: "client" | "admin";
  company?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export const DEMO_CREDENTIALS: AuthCredentials = {
  email: "demo@cete.fr",
  password: "Cete2026",
};

export const ADMIN_CREDENTIALS: AuthCredentials = {
  email: "admin@cete.fr",
  password: "Admin2026",
};
