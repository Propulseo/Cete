import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Client Supabase SERVICE-ROLE — SERVER ONLY (bypasse la RLS).
 * À n'importer QUE depuis du code serveur (Server Actions, route handlers).
 * Utilise SUPABASE_SERVICE_ROLE_KEY (jamais NEXT_PUBLIC_) → non exposé au client.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
