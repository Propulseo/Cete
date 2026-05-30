// Vérifie le flux "Espace client" : admin publie un document assigné à un client,
// le client le voit (RLS), puis nettoyage. node scripts/verify-publish-to-client.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/).filter((l) => l && !l.trimStart().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const mk = () => createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const results = [];
const check = (n, ok, d = "") => results.push({ n, ok: !!ok, d });

// 1) Admin publie un document assigné au client démo.
const admin = mk();
const { error: ae } = await admin.auth.signInWithPassword({ email: "admin@cete.fr", password: "password" });
check("admin login", !ae, ae?.message);
const { data: client } = await admin.from("clients").select("id").eq("slug", "societe-demo").maybeSingle();
const clientId = client?.id;
check("client démo trouvé", !!clientId);
const title = `_verify publish ${Date.now()}`;
const { data: doc, error: ie } = await admin.from("client_documents").insert({
  title, category: "guides", type: "pdf", description: "test", visibility: "assigned",
  assigned_client_ids: [clientId], access_type: "download", url: "/x.pdf",
}).select("id").single();
check("admin publie un doc assigné (RLS is_admin)", !ie && !!doc, ie?.message);
await admin.auth.signOut();

// 2) Le client le voit-il ?
const cli = mk();
await cli.auth.signInWithPassword({ email: "client@cete.fr", password: "password" });
const { data: seen } = await cli.from("client_documents").select("id,title,category").eq("category", "guides");
const found = (seen ?? []).some((d) => d.id === doc?.id);
check("le client voit le doc publié (page Guides)", found, `${seen?.length ?? 0} guides visibles`);
await cli.auth.signOut();

// 3) Cleanup
const admin2 = mk();
await admin2.auth.signInWithPassword({ email: "admin@cete.fr", password: "password" });
if (doc?.id) await admin2.from("client_documents").delete().eq("id", doc.id);
await admin2.auth.signOut();
check("cleanup", true);

let pass = 0;
for (const r of results) { console.log(`${r.ok ? "PASS" : "FAIL"} — ${r.n}${r.d ? ` (${r.d})` : ""}`); if (r.ok) pass++; }
console.log(`\n${pass}/${results.length} checks PASS`);
process.exit(pass === results.length ? 0 : 1);
