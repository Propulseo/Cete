// Vérifie les écritures admin de bout en bout (RLS WITH CHECK + FK).
// Crée client + contact + évaluation (FK auditor->founders) + contract_document
// (FK uploaded_by->profiles), complète l'évaluation, puis nettoie. node scripts/verify-admin-writes.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });

const sb = createClient(SB_URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
const { error: se } = await sb.auth.signInWithPassword({ email: "admin@cete.fr", password: "password" });
check("admin login", !se, se?.message ?? "");
const { data: { user } } = await sb.auth.getUser();

const { data: founders } = await sb.from("founders").select("id").limit(1);
const auditorId = founders?.[0]?.id;
check("founder disponible (auditeur)", !!auditorId);

const tag = Date.now();
const { data: client, error: ce } = await sb
  .from("clients")
  .insert({
    slug: `test-write-${tag}`, company_name: `Test Write ${tag}`, legal_form: "SAS",
    siret: `TW${tag}`, sector: "tertiaire", address_street: "1 rue Test",
    address_postal_code: "75001", address_city: "Paris", status: "active", internal_notes: "",
  })
  .select("id")
  .single();
check("admin crée un client (RLS WITH CHECK)", !ce && !!client, ce?.message ?? "");
const clientId = client?.id;

const { error: cce } = await sb
  .from("client_contacts")
  .insert({ client_id: clientId, first_name: "Alice", last_name: "Martin", role: "Responsable", is_primary: true });
check("admin crée un contact", !cce, cce?.message ?? "");

const { data: ev, error: ee } = await sb
  .from("evaluations")
  .insert({ client_id: clientId, site_name: "Site A", site_address: "x", visit_date: "2026-06-01", auditor_id: auditorId, status: "scheduled" })
  .select("id")
  .single();
check("admin crée une évaluation (FK auditor->founders)", !ee && !!ev, ee?.message ?? "");

const { data: doc, error: de } = await sb
  .from("contract_documents")
  .insert({ client_id: clientId, type: "report", title: "Rapport test", version: 1, file_name: "r.pdf", file_size: 1000, mime_type: "application/pdf", uploaded_by: user.id, status: "signed" })
  .select("id")
  .single();
check("admin crée un contract_document (FK uploaded_by->profiles)", !de && !!doc, de?.message ?? "");

const { error: ue } = await sb
  .from("evaluations")
  .update({ status: "completed", vigi_score: "B", composite_rating: "BAB", report_document_id: doc?.id })
  .eq("id", ev?.id);
check("admin complète l'évaluation (composite_rating CHECK)", !ue, ue?.message ?? "");

// cleanup (eval + doc d'abord car client_id est RESTRICT)
await sb.from("evaluations").delete().eq("id", ev?.id);
await sb.from("contract_documents").delete().eq("id", doc?.id);
const { error: dce } = await sb.from("clients").delete().eq("id", clientId);
check("cleanup : client supprimé (contacts cascade)", !dce, dce?.message ?? "");

await sb.auth.signOut();

let pass = 0;
for (const r of results) { console.log(`${r.ok ? "PASS" : "FAIL"} — ${r.name}${r.detail ? ` (${r.detail})` : ""}`); if (r.ok) pass++; }
console.log(`\n${pass}/${results.length} checks PASS`);
process.exit(pass === results.length ? 0 : 1);
