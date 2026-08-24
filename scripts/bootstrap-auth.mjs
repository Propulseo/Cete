// Bootstrap des comptes initiaux via la Supabase Admin API (service-role).
// Lit .env (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
// Usage : node scripts/bootstrap-auth.mjs
// Crée : 1 client démo + admin@cete.fr (admin) + client@cete.fr (client lié au client démo).
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Manque NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY dans .env");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureClient() {
  const { data: existing } = await admin
    .from("clients")
    .select("id")
    .eq("siret", "12345678900012")
    .maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await admin
    .from("clients")
    .insert({
      slug: "societe-demo",
      company_name: "Société Démo",
      legal_form: "SAS",
      siret: "12345678900012",
      sector: "tertiaire",
      address_street: "1 rue de la Démo",
      address_postal_code: "75001",
      address_city: "Paris",
      address_country: "France",
      status: "active",
      internal_notes: "",
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function ensureUser(email, password, meta) {
  const { data: list, error: le } = await admin.auth.admin.listUsers();
  if (le) throw le;
  const found = list.users.find((u) => u.email === email);
  if (found) {
    console.log("exists :", email, found.id);
    return found.id;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  });
  if (error) throw error;
  console.log("created:", email, data.user.id);
  return data.user.id;
}

const clientId = await ensureClient();
console.log("client démo id:", clientId);

await ensureUser("admin@cete.fr", "password", { role: "admin", name: "Admin CETé" });
await ensureUser("client@cete.fr", "password", {
  role: "client",
  name: "Client Démo",
  client_id: clientId,
  company: "Société Démo",
});

const { data: profs } = await admin
  .from("profiles")
  .select("email, role, client_id, company, is_active")
  .order("role");
console.log("profiles:", JSON.stringify(profs, null, 2));
console.log("OK");
