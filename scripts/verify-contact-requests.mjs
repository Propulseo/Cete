// Vérifie que la captation des leads écrit vraiment en base.
// Lecture seule : liste les dernières lignes de contact_requests. N'écrit rien,
// ne supprime rien. Utilise la clé service-role, comme la Server Action, car la
// RLS de la table réserve la lecture aux admins.
//
//   node scripts/verify-contact-requests.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error, count } = await sb
  .from("contact_requests")
  .select("id, kind, name, email, company, locale, status, ip, created_at, payload, subject", {
    count: "exact",
  })
  .order("created_at", { ascending: false })
  .limit(5);

if (error) {
  console.error("❌ lecture impossible :", error.message);
  process.exit(1);
}

console.log(`✅ table lisible — ${count} demande(s) enregistrée(s) au total`);
console.log("Les 5 plus récentes :");
for (const r of data) {
  const extra = r.kind === "contact" ? `sujet="${r.subject ?? ""}"` : `payload=${JSON.stringify(r.payload)}`;
  console.log(
    `  · ${r.created_at} [${r.kind}] ${r.name} <${r.email}> — ${r.company} (${r.locale}, ${r.status}, ip=${r.ip ?? "—"})\n    ${extra}`,
  );
}
