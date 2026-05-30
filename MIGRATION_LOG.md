# Migration log — Supabase (B3)

> Projet : `tefcbvbvrwwbshkyuekh` (Cete, eu-central-1) · Appliqué le 2026-05-29 via MCP Supabase `apply_migration`.

## Migrations appliquées (dans l'ordre, succès)

| # | Nom | Contenu | Vérif |
|---|---|---|---|
| 1 | `init_schema` | 13 tables + FK + indexes + CHECK + RLS activée | ✅ 13 tables, `rls_enabled=true` partout |
| 2 | `rls_policies` | helpers `is_admin()`/`current_client_id()` + policies (WITH CHECK) | ✅ |
| 3 | `triggers_and_functions` | `set_updated_at`, `handle_new_user`, `slugify`, `clients_set_slug`, `profiles_guard_self_edit`, `set_primary_contact` + 4 vues | ✅ |
| 4 | `storage_buckets` | 3 buckets privés + policies `storage.objects` | ✅ 3 buckets |
| 5 | `seed_initial` | `settings` (1) + `founders` (4, bilingue) | ✅ settings=1, founders=4 (3 visibles), `company` {fr,en} OK |
| 6 | `security_hardening` | search_path fixe + `v_certificate_public` → security_invoker + accès anon colonne-safe | ✅ ERROR `security_definer_view` résolu |
| 7 | `revoke_trigger_fn_execute` | revoke EXECUTE PUBLIC sur `handle_new_user`/`profiles_guard_self_edit` | ✅ |

## État des advisors (post-migration)

- **Sécurité** : 0 ERROR · 4 WARN résiduels — tous `*_security_definer_function_executable` sur `is_admin()` et `current_client_id()`. **Acceptés** : ces helpers sont requis par les policies RLS (doivent rester exécutables par anon+authenticated) et ne renvoient que le statut de l'appelant (pas de fuite de données). [doc lint](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- **Performance** : non bloquant sur base vide (surtout « unused index » car aucune requête encore exécutée). À réauditer après mise en charge réelle.

## Non encore fait (étapes suivantes)

- **Bootstrap 1er admin** (B4) : via Supabase Admin API (`auth.admin.createUser`, `raw_user_meta_data.role='admin'`).
- **Données métier démo** (clients/évals/certifs/docs) : non seedées (base propre ; clients créés via l'admin). Seed possible plus tard via script de remap ids (§13).
- **Branchement code** (B3.5/B4) : `@supabase/ssr`, `lib/supabase/*`, refactor repos lecture puis écriture, auth.

## Rollback

Projet dédié + branche `migration/supabase`. Rollback DB possible via `drop`/`reset` du schéma `public` (aucune donnée prod). Code non encore modifié à ce stade.

---

## Frontière §6 — vitrine ↔ DB (founders + settings)

Dernière frontière de la migration : la vitrine publique lisait encore le JSON statique
(`data-loader.getFounders`/`getContactInfo`) alors que l'admin édite founders/settings **en DB**.
Conséquence corrigée : une édition admin (fondateur, coordonnées) se reflète désormais sur le site public.

- **Nouveau** : `src/lib/vitrine-data.ts` — lecteurs **server-side locale-aware** (`loadFounders`, `loadContactInfo`)
  via le client Supabase serveur. jsonb `{fr,en}` résolu selon la locale. **Fallback JSON** sur toute erreur
  (DB injoignable / RLS / settings absents) → la vitrine ne casse jamais.
- **RLS exploitée** : `founders_public_select (visible=true)` + `settings_public_select (true)` → lecture anon OK.
- **Consommateurs vivants câblés** :
  - `common/Footer.tsx` (server) → `await loadContactInfo(locale)`
  - `(public)/page.tsx` → `loadFounders` → prop `<HomeFounders founders=…/>` (client)
  - `(public)/a-propos/page.tsx` → `loadFounders` → prop `<AboutFounders founders=…/>` (client)
  - `(public)/contact/page.tsx` → `loadContactInfo` → prop `<ContactMain contact=…/>` → `ContactSidebar`
- **Code mort laissé sur JSON (non rendu, inoffensif)** : `FoundersGrid`, `sections/ContactInfo`, `contact/ContactMap`.
- **Rendu** : le Footer (layout `(public)`) lisant la DB, tout le segment public passe en **dynamique** (`ƒ`) — assumé pour refléter les éditions admin en temps réel.
- **Vérifs** : `tsc --noEmit` ✅ · `npm run build` ✅ · runtime (serveur prod :3100) :
  founders DB rendus (3 visibles, Denis `visible=false` absent), locale-aware (`/en` rôles EN, `/fr` rôles FR),
  email `contact@cete-notation.fr` (settings DB) présent dans footer + page contact.

> Note : les 2 frontières DB de §6 sont closes — `/verifier/[id]` (fait précédemment) + founders/settings vitrine (ci-dessus).
> ContactForm V2 (Resend) reste hors-scope, comme convenu.

---

## Frontière §7 — flux documents admin → portail client (2026-05-30)

Symptôme rapporté : « je dépose des docs sur un client, le client (`team@propulseo-site.com`) ne voit rien »
+ « la structure du portail client est totalement différente de la fiche client admin ».

### Causes identifiées
1. **Compte orphelin** : `profiles.client_id = NULL` pour `team@propulseo-site.com` → `current_client_id()` NULL
   → la RLS ne renvoyait que le contenu `global`. (Le compte n'avait jamais été rattaché via « Ouvrir un accès ».)
2. **Piège d'UX** : le bouton « Nouveau document » + l'onglet « Documents » écrivent dans `contract_documents`
   (CRM **interne**, RLS admin-only) — jamais visibles par le client. Le seul chemin portail était l'onglet
   « Espace client » (→ `client_documents` assignés).
3. **Trou structurel** : aucune page portail n'exposait les documents propres du client (rapports/contrats).

### Migration 11 — `20260530000001_client_contract_documents_read.sql`
- **Table** `contract_documents` : nouvelle policy `contract_documents_client_select`
  = `client_id = current_client_id() AND type ∈ {report,contract,addendum} AND status ∈ {sent,signed}`.
  (Brouillons/devis/offres restent internes. Policy admin `*_admin_all` intacte → admin voit tout.)
- **Storage** `contract-documents` : policy `contract_documents_client_read` (lecture du dossier `<client_id>/…`,
  miroir de `certificates_client_read`).

### Code
- `contract-documents.repo.ts` : `getClientContractDocuments()` (RLS + filtre défensif) + `isClientVisibleContractDocument()`.
- **Nouvelle page portail** `client/documents` « Mes documents » (rapports + contrats signés, download URL signée) + entrée sidebar + i18n FR/EN.
- **Cohérence admin** : colonne « Visibilité » (Visible client / Interne) dans l'onglet Documents + bandeau d'info ;
  correction du texte de l'onglet « Espace client » (les rapports/contrats signés sont désormais visibles côté client).
- **Garde-fou orphelin** : message portail explicite si client sans entreprise (layout) + badge « Non rattaché » dans `/admin/users`.

### Data
- Rattaché `team@propulseo-site.com` → société « test » (`8ed9e2e3…`) ; seed d'une capsule assignée pour démo.

### Vérifs
- Build ✅ (route `/[locale]/client/documents` générée) · line-lint ✅ · advisors sécurité : aucun nouveau.
- RLS simulée : client `team@` → voit **uniquement** `testttt` (contract/sent de SA société) ; Société Démo → **uniquement** son propre rapport ; admin → 17 docs (tous).

---

## Frontière §8 — dépôt certificat en service-role + écueil session par-origine (2026-05-30)

Symptôme : `POST /storage/v1/object/certificates/... 400` au dépôt d'un certificat « en tant qu'admin » ;
page client « Ma notation » vide alors que le dashboard montrait la notation.

### Cause bug 1 (400 storage)
Postgres logs : `new row violates row-level security policy for table "objects"`. Les policies storage
`certificates`/`contract-documents` sont **identiques et correctes** (`is_admin()`), et `is_admin()` est vrai
pour l'admin (vérifié SQL). Donc l'upload partait d'une **session NON-admin**. Auth logs : login/logout alternés
`team@` (client) ↔ `admin@`, requêtes depuis **deux origines `localhost:3000` ET `:3001`**. Les sessions Supabase
sont **par-origine** → le dialog certificat tournait sur le port où `team@` (client) était la session active →
`is_admin()` faux → RLS rejette (400 opaque). **Écueil de test multi-ports, pas un bug de policy.**

### Fix (robuste + erreur lisible)
- Nouveau Server Action `src/app/actions/certificates.ts` → `createCertificateAction(input, formData)` :
  `assertAdmin()` puis upload Storage + insert `certificates` + lien `evaluations.certificate_id` en **service-role**.
  Indépendant de l'état de session navigateur ; renvoie « Action réservée aux administrateurs » si non-admin
  (au lieu d'un 400 Storage opaque). Même pattern que `createUserAction`.
- `CertificateFormDialog` : appelle l'action (PDF via FormData), prop `evaluationId`, `onCreated(certId)`,
  + `DialogDescription` (corrige le warning a11y Radix).
- Page évaluations : passe `evaluationId`, le lien éval→cert est posé serveur.

### Cause bug 2 (notation page vide)
Société « test » avait une évaluation **complétée (B/BBB) mais aucun certificat** (tous les dépôts échouaient).
Le dashboard montre l'ÉVALUATION (ClientEvaluationsCard) ; la page notation lit les **certificats** → vide.
Résolu en déposant le certificat (fix bug 1). Vérifié : `team@` voit `CETE-2026-A2A2` (B/BBB, PDF) sous RLS.

### Vérifs
- Build ✅. RLS simulée : `team@` voit son certificat ; admin voit les 17 contract-docs ; isolation cross-tenant OK.
