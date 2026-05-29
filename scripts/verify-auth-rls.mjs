// Vérification auth + RLS via le vrai chemin JWT (signInWithPassword → RLS).
// Teste anon / admin / client + isolation multi-tenant. Usage : node scripts/verify-auth-rls.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY;

const svc = createClient(SB_URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const fresh = () => createClient(SB_URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } });

// 2e client (pour tester l'isolation) — créé via service-role, supprimé en fin.
async function ensureSecondClient() {
  const { data } = await svc.from("clients").select("id").eq("siret", "99999999900099").maybeSingle();
  if (data) return data.id;
  const { data: ins, error } = await svc.from("clients").insert({
    slug: "autre-client-test", company_name: "Autre Client SARL", legal_form: "SARL",
    siret: "99999999900099", sector: "industrie", address_street: "2 av Test",
    address_postal_code: "69001", address_city: "Lyon", status: "active", internal_notes: "",
  }).select("id").single();
  if (error) throw error;
  return ins.id;
}

// ── anon ──────────────────────────────────────────────────────────────────
{
  const anon = fresh();
  const { data: f } = await anon.from("founders").select("id, visible");
  check("anon voit les founders visibles", f && f.length >= 1 && f.every((x) => x.visible !== false), `${f?.length ?? 0} founders`);
  const { data: s } = await anon.from("settings").select("id");
  check("anon voit settings (footer public)", (s?.length ?? 0) === 1);
  const { data: c } = await anon.from("clients").select("id");
  check("anon NE voit PAS les clients (RLS)", (c?.length ?? 0) === 0, `${c?.length ?? 0} vus`);
  const { data: p } = await anon.from("profiles").select("id");
  check("anon NE voit PAS les profiles", (p?.length ?? 0) === 0, `${p?.length ?? 0} vus`);
  const { data: cert } = await anon.from("certificates").select("id");
  check("anon NE lit PAS la table certificates", (cert?.length ?? 0) === 0, `${cert?.length ?? 0} vus`);
}

const secondId = await ensureSecondClient();
const { count: totalClients } = await svc.from("clients").select("*", { count: "exact", head: true });

// ── admin ─────────────────────────────────────────────────────────────────
{
  const a = fresh();
  const { error: se } = await a.auth.signInWithPassword({ email: "admin@cete.fr", password: "password" });
  check("admin : login OK", !se, se?.message ?? "");
  const { data: isAdmin } = await a.rpc("is_admin");
  check("admin : is_admin() = true", isAdmin === true, `${isAdmin}`);
  const { data: c } = await a.from("clients").select("id");
  check("admin : voit TOUS les clients", (c?.length ?? 0) === (totalClients ?? 0), `${c?.length ?? 0}/${totalClients}`);
  const { data: p } = await a.from("profiles").select("id");
  check("admin : voit tous les profiles", (p?.length ?? 0) >= 2, `${p?.length ?? 0}`);
  await a.auth.signOut();
}

// ── client (isolation multi-tenant) ─────────────────────────────────────────
{
  const cl = fresh();
  const { error: se } = await cl.auth.signInWithPassword({ email: "client@cete.fr", password: "password" });
  check("client : login OK", !se, se?.message ?? "");
  const { data: isAdmin } = await cl.rpc("is_admin");
  check("client : is_admin() = false", isAdmin === false, `${isAdmin}`);
  const { data: ccid } = await cl.rpc("current_client_id");
  check("client : current_client_id() défini", !!ccid, `${ccid}`);
  const { data: c } = await cl.from("clients").select("id");
  check("client : voit UNIQUEMENT son client (1)", (c?.length ?? 0) === 1 && c[0]?.id === ccid, `${c?.length ?? 0} vus`);
  check("client : NE voit PAS l'autre client (multi-tenant)", !(c ?? []).some((x) => x.id === secondId), "isolation");
  const { data: p } = await cl.from("profiles").select("id");
  check("client : voit seulement son profil (1)", (p?.length ?? 0) === 1, `${p?.length ?? 0}`);
  // tentative d'escalade : un client ne doit pas pouvoir se promouvoir admin
  const { data: me } = await cl.from("profiles").select("id").eq("id", (await cl.auth.getUser()).data.user.id).single();
  const { error: escErr } = await cl.from("profiles").update({ role: "admin" }).eq("id", me.id);
  check("client : escalade role=admin BLOQUÉE (trigger)", !!escErr, escErr ? escErr.message.slice(0, 60) : "AUCUNE erreur = FAILLE");
  await cl.auth.signOut();
}

// cleanup du 2e client de test
await svc.from("clients").delete().eq("id", secondId);

let pass = 0;
for (const r of results) { console.log(`${r.ok ? "PASS" : "FAIL"} — ${r.name}${r.detail ? ` (${r.detail})` : ""}`); if (r.ok) pass++; }
console.log(`\n${pass}/${results.length} checks PASS`);
process.exit(pass === results.length ? 0 : 1);
