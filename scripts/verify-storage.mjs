// Vérifie le dépôt de fichiers de bout en bout (Supabase Storage + policies RLS admin).
// Connecté en admin@cete.fr : upload → URL signée → fetch → suppression, sur les 3 buckets.
// node scripts/verify-storage.mjs
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

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });

const sb = createClient(SB_URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
const { error: se } = await sb.auth.signInWithPassword({ email: "admin@cete.fr", password: "password" });
check("admin login", !se, se?.message ?? "");

// Un client existant pour préfixer les chemins (policies <client_id>/...).
const { data: client } = await sb.from("clients").select("id").limit(1).maybeSingle();
const clientId = client?.id ?? "global";

const payload = new Blob([`CETe storage check ${Date.now()}`], { type: "text/plain" });

const cases = [
  { bucket: "contract-documents", path: `${clientId}/_verify-${Date.now()}.txt` },
  { bucket: "certificates", path: `${clientId}/_verify-${Date.now()}.txt` },
  { bucket: "client-documents", path: `global/_verify-${Date.now()}.txt` },
];

for (const c of cases) {
  const { error: ue } = await sb.storage.from(c.bucket).upload(c.path, payload, { upsert: true, contentType: "text/plain" });
  check(`upload → ${c.bucket}`, !ue, ue?.message ?? "");
  if (ue) continue;

  const { data: signed, error: sge } = await sb.storage.from(c.bucket).createSignedUrl(c.path, 60);
  check(`URL signée → ${c.bucket}`, !sge && !!signed?.signedUrl, sge?.message ?? "");

  if (signed?.signedUrl) {
    const res = await fetch(signed.signedUrl);
    const body = await res.text();
    check(`fetch contenu → ${c.bucket}`, res.ok && body.startsWith("CETe storage check"), `HTTP ${res.status}`);
  }

  const { error: de } = await sb.storage.from(c.bucket).remove([c.path]);
  check(`cleanup → ${c.bucket}`, !de, de?.message ?? "");
}

await sb.auth.signOut();

let pass = 0;
for (const r of results) { console.log(`${r.ok ? "PASS" : "FAIL"} — ${r.name}${r.detail ? ` (${r.detail})` : ""}`); if (r.ok) pass++; }
console.log(`\n${pass}/${results.length} checks PASS`);
process.exit(pass === results.length ? 0 : 1);
