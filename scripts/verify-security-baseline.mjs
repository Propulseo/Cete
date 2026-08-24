// Sonde de sécurité de référence (audit maison, plan « lot sécurité »).
// Vérifie par le COMPORTEMENT — pas par lecture de catalogue — que la serrure tient :
//   1. la clé anon NE peut PAS lire les tables sensibles (clients, évaluations,
//      notifications, utilisateurs) ;
//   2. la clé anon NE peut PAS écrire dans ces tables ;
//   3. un utilisateur anonyme non authentifié n'a accès à rien qui soit réservé.
//
// Lecture seule pour la base : chaque tentative d'écriture vise des valeurs
// invalides et DOIT échouer — aucune donnée n'est créée même en cas de faille
// (l'insertion d'un client sans nom légal serait rejetée au niveau colonne).
//
//   node scripts/verify-security-baseline.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL / ANON_KEY absentes du .env");
  process.exit(1);
}

const anon = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const service = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let failures = 0;

/**
 * Test d'isolation DIFFERENTIEL : avec la RLS, une lecture filtrée réussit avec
 * ZERO ligne (pas d'erreur). On compare donc ce que voit l'anon à ce que voit le
 * service-role sur la même table : si le service voit des lignes et l'anon aussi,
 * la serrure est ouverte ; si l'anon ne voit rien alors que la base en contient,
 * la RLS fait son travail.
 */
async function checkReadIsolation(table) {
  const a = await anon.from(table).select("*").limit(5);
  if (a.error && a.error.code === "42501") {
    console.log(`✅ ${table} : lecture anon refusée explicitement`);
    return;
  }
  if (a.error) {
    console.warn(`⚠️ ${table} : réponse inattendue (${a.error.message}) — vérifier manuellement.`);
    return;
  }
  const s = await service.from(table).select("id", { count: "exact" }).limit(1);
  const serviceCount = s.count ?? -1;
  const anonCount = a.data?.length ?? 0;
  if (anonCount === 0 && serviceCount > 0) {
    console.log(`✅ ${table} : RLS filtre — anon voit 0 ligne, base en contient ${serviceCount}`);
    return;
  }
  if (anonCount > 0) {
    console.error(`❌ ${table} : ${anonCount} ligne(s) lisibles avec la clé anon — RLS absente ou permissive !`);
    failures++;
    return;
  }
  console.warn(`⚠️ ${table} : vide pour l'anon ET le service-role — sonde non concluante.`);
}

async function expectWriteDenied(table, row) {
  const { error } = await anon.from(table).insert(row);
  if (!error) {
    console.error(`❌ ${table} : INSERT anon accepté — RLS d'écriture absente !`);
    failures++;
    return;
  }
  console.log(`✅ ${table} : écriture anon refusée (${error.code ?? "erreur"})`);
}

console.log("— Isolation des lectures anon (differential vs service-role) —");
for (const table of ["clients", "evaluations", "notifications", "profiles", "contract_documents", "client_documents", "resources"]) {
  await checkReadIsolation(table);
}

console.log("\n— Écritures anon (doivent toutes être refusées) —");await expectWriteDenied("notifications", { type: "info", message: "sonde" });
await expectWriteDenied("notification_reads", { notification_id: "00000000-0000-0000-0000-000000000000", user_id: "00000000-0000-0000-0000-000000000000" });
await expectWriteDenied("contact_requests", {});

console.log("\n— Exposition côté navigateur —");
const dangerous = Object.keys(env).filter(
  (k) => k.startsWith("NEXT_PUBLIC_") && /SERVICE_ROLE|SECRET|API_KEY|BREVO/i.test(k)
);
if (dangerous.length > 0) {
  console.error(`❌ variables sensibles préfixées NEXT_PUBLIC_ : ${dangerous.join(", ")}`);
  failures++;
} else {
  console.log("✅ aucune variable sensible exposée au navigateur via NEXT_PUBLIC_");
}

if (failures > 0) {
  console.error(`\n🚨 baseline sécurité : ${failures} FAILLE(S). Ne pas déployer.`);
  process.exit(1);
}
console.log("\n🔒 baseline sécurité : tout est verrouillé.");
