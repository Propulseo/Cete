// Diagnostic : que voit RÉELLEMENT le client (RLS appliquée) ?
// Connecté client@cete.fr → liste client_documents/resources visibles, par catégorie.
// node scripts/verify-client-visibility.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/).filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: se } = await sb.auth.signInWithPassword({ email: "client@cete.fr", password: "password" });
console.log(se ? `FAIL login: ${se.message}` : "PASS client login");
const { data: { user } } = await sb.auth.getUser();
const { data: prof } = await sb.from("profiles").select("client_id").eq("id", user.id).maybeSingle();
console.log(`client_id du compte : ${prof?.client_id}`);

const { data: docs } = await sb.from("client_documents").select("category,visibility,title");
console.log(`\nclient_documents visibles (${docs?.length ?? 0}) :`);
for (const d of docs ?? []) console.log(`  [${d.category}] ${d.title} (${d.visibility})`);

const { data: res } = await sb.from("resources").select("category,visibility,title");
console.log(`\nresources visibles (${res?.length ?? 0}) :`);
for (const r of res ?? []) console.log(`  [${r.category}] ${r.title} (${r.visibility})`);

await sb.auth.signOut();
