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
