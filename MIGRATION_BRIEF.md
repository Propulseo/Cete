# Brief de migration — CETé → Supabase

> Généré le : 2026-05-29 · Phase 00.04 (`prompts/00-audit-logique-metier/04-handoff-data-migration`).
> **Document d'entrée du workflow `04-data-migration/`.** Ne duplique pas `BACKEND_SPEC.md` — y renvoie par section.

---

## 1. Contexte

CETé = site vitrine FR/EN (next-intl, tout sous `src/app/[locale]/`) d'une **agence de notation/certification du risque électrique**, avec back-office admin (~14 pages) + portail client (8 pages) + vérification publique de certificat. **Stack actuelle** : front complet **front-only**, données 100 % mockées en **localStorage** (12 repos `src/lib/repo/*.repo.ts` + `storage.ts`) et JSON statiques, **aucun backend réel**, auth mock localStorage. **Stack cible** : Next.js 16 (App Router, RSC + Server Actions) + **Supabase** (Auth + Postgres + RLS + Storage), hosting VPS OVH (Coolify). **Volume** : 13 tables, 12 FK (+3 `uuid[]`), 7 triggers/fonctions, 4 vues, 2 RPC, 3 buckets, ~16 Server Actions (cf. `BACKEND_SPEC.md` §1). **Particularités** : i18n omniprésent (à préserver) · `founders`/`settings` **bilingues en DB** (`jsonb {fr,en}`) · `organizations` reste **statique** (pas de table) · site vitrine intouchable sauf 3 frontières (`/verifier/[id]`, `founders`/`settings`, `ContactForm` laissé) · auditeur = **founder** · certificat **déposé par l'admin** (upload) · isolation multi-tenant stricte (RLS + `WITH CHECK` + trigger anti-escalade `profiles` + vue `v_certificate_public` pour l'anon). **Package manager : npm** (pas pnpm — adapter les commandes). **Toutes les opérations DB via MCP Supabase** (projet `tefcbvbvrwwbshkyuekh`, schéma `public` vide, prêt).

## 2. Documents à consulter

| Doc | Contenu | Quand |
|---|---|---|
| `ENTITIES_MAP.md` | 13 entités, attributs, relations/FK, énums | B1 (cohérence mocks), B2 (mapping) |
| `IMPLICIT_BUSINESS_LOGIC.md` | 11 KPI, 9 états dérivés, 11 side effects | B2 (vues/triggers), B4 (Server Actions), B6 (tests side effects) |
| `BACKEND_SPEC.md` | Schéma SQL, RLS, triggers, vues/RPC, buckets, Server Actions — **source primaire** | B2→B7 (tout) |
| `MIGRATION_BRIEF.md` *(ce doc)* | Pont, séquence, checklist, risques | démarrage B (priorité absolue) |

## 3. Adaptations du workflow `04-data-migration/`

Séquence réelle : **01 → 02 → 03 → 03.5 → 04 → 4b → 05** (deux raffinements insérés : 3.5 et 4b).

1. **`01-audit-mock-data`** → **vérification de cohérence** (pas découverte). **Écarts déjà identifiés (cf. BACKEND_SPEC §13)** : sources de seed **mixtes racine + `fr/`** (PAS « fr/ only ») · 3/4 `evaluations.certificate_id` orphelins → `NULL` au seed · remap ids texte→uuid (dont `uploaded_by=adm-001`, founder ids `"1".."4"`) · `en/` métier divergents (`omtScore`) à **supprimer** · `notifications.read` à dropper · aplatissements view-model (`client_documents` wrapper, `contact_info.maps`) · double timestamp `resources`.
2. **`02-plan-schema-supabase`** → part de `BACKEND_SPEC.md` §2/§3/§5/§7. Produit : **5 migrations SQL** (cf. §9 spec) + indexes + **dictionnaire mapping camelCase ↔ snake_case** + `supabase gen types`.
3. **`03-migration-execution`** → applique via **MCP Supabase `apply_migration`**, une par une, vérif counts/tables/policies entre chaque. Vérifie vues (spec §4) + triggers (spec §6). **STOP si erreur.**
4. **`04-branchement-lecture-supabase` (3.5)** → installe `@supabase/ssr` + `@supabase/supabase-js`, crée `lib/supabase/{client,server}.ts`, complète `middleware.ts` (session Supabase **en plus** de l'i18n next-intl), réécrit les **lectures** des repos, rebranche `/verifier/[id]` en **Server Component + RLS anon**. Écritures encore en localStorage. KPI spec §4 doivent afficher juste.
5. **`04-branchement-modals-crud` (4)** → écritures + auth (mode auth à confirmer : password vs magic link). Server Actions = spec §10. **Correction bug latent** : pages client filtrent par `user.clientId` (pas `user.id`). Workflows transactionnels : déposer certificat, compléter évaluation (spec §6). Suppression localStorage + `storage.ts` en fin.
6. **`06-test-fonctionnel-crud` (4b)** → tests guidés : login admin+client, toutes pages, CRUD 2-3 entités, `/verifier`, **fuite multi-tenant** (client A ≠ client B), side effects (spec §6) + états dérivés (spec §5).
7. **`05-verification-post-migration` (5)** → audit final : cohérence schéma↔spec, RLS multi-user, KPI justes, side effects enchaînés, **build + typecheck**, **vitrine non cassée**, `.env.example` à jour, zéro import mock résiduel, tous les `// TODO Supabase:` résolus.

## 4. Checklist d'entrée

```
[ ] ENTITIES_MAP.md relu et validé
[ ] IMPLICIT_BUSINESS_LOGIC.md relu et validé
[ ] BACKEND_SPEC.md relu, 6 décisions AMBIGU tranchées ✅ (faites)
[ ] Projet Supabase créé ✅ (tefcbvbvrwwbshkyuekh, public vide) + .env.local à configurer
[ ] Mode d'auth Supabase choisi (password / magic link) — À TRANCHER avant B4
[ ] Branche dédiée migration/supabase + état git propre (rollback possible)
[ ] Décider du sort du WIP non commité (~80 fichiers M) + commit 774cb1d non poussé + push admin/clients
```

## 5. Risques résiduels

- **Reprise de la spec (§11)** : fuite multi-tenant RLS · workflows admin multi-étapes (atomicité) · sur-exposition anon (certificates/founders/settings).
- **Propres à la migration** : sources de seed **mixtes racine + `fr/`** (cf §13 ; `en/` métier à supprimer) · désync types TS ↔ schéma (régénérer via `supabase gen types`) · RLS trop restrictive au 1er test (smoke test auth d'abord) · **i18n cassé** si le middleware Supabase écrase la nego de locale next-intl (composer, pas remplacer) · **vitrine cassée** si un refactor déborde du périmètre (STOP immédiat) · remap ids texte→uuid **global** (§13) · URL QR `cete-adn.fr` ≠ env.
- **État git** : working tree chargé (WIP i18n+redesign non commité) + commit `774cb1d` (admin/clients) non poussé → **isoler la migration sur une branche** pour garder un rollback propre.

## 6. Critères de succès post-migration

- Toutes les pages admin + client tournent sur **données Supabase** (zéro localStorage métier).
- Tous les **KPI cohérents** (dashboard admin, cartes clients, distribution Vigi-Score, compteurs portail).
- Tous les **side effects** s'enchaînent (déposer certificat, compléter évaluation, mark-as-read par client, archivage client).
- `/verifier/[id]` public **SEO-friendly** en lecture serveur (RLS anon, certificats `valide`).
- **Tests RLS multi-user au vert** (client A ne voit jamais les données de client B).
- **TTFB < 500 ms** sur le dashboard · `npm run build` + `tsc` au vert · **zéro régression visuelle** vitrine vs mocks · `.env.example` à jour.

## 7. Commande de lancement (workflow suivant)

```
Tu démarres le workflow 04-data-migration/. Avant toute action tu lis :
1. MIGRATION_BRIEF.md (priorité absolue)
2. ENTITIES_MAP.md, IMPLICIT_BUSINESS_LOGIC.md, BACKEND_SPEC.md
Puis tu exécutes la séquence réelle (01 → 02 → 03 → 03.5 → 04 → 4b → 05)
en suivant les adaptations de la section 3 de ce brief.
Contraintes CETé : npm (pas pnpm) · MCP Supabase pour TOUT le DB ·
vitrine intouchable (STOP si touchée) · i18n préservé · branche dédiée.
Tu commences par l'étape 01 (audit mock data en mode vérification de cohérence),
et tu STOP après chaque étape pour validation.
```

---

## État des 4 livrables de la phase audit (à la racine)
- ✅ `ENTITIES_MAP.md` · ✅ `IMPLICIT_BUSINESS_LOGIC.md` · ✅ `BACKEND_SPEC.md` · ✅ `MIGRATION_BRIEF.md`

> **Fin du workflow d'audit logique métier (phase 00).** Le passage en Phase B (`04-data-migration/`) crée les tables Supabase + modifie le code → **nouveau GO explicite requis**.
