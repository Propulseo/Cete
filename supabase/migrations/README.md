# Migrations Supabase — route d'application

## ⚠️ `supabase db push` n'est PAS la route de ce projet

La base a été construite **à la main, via le SQL Editor du dashboard Supabase**.
Le projet n'a jamais été lié à la CLI : il n'existe aucun `supabase/config.toml`.

Un `supabase db push` contre la base existante **échouerait dès la première
migration** : `20260529000001_init_schema.sql`, `20260529000002_rls_policies.sql`
et `20260529000003_triggers_and_functions.sql` utilisent `create table`,
`create policy` et `create index` sans `if not exists` — le push s'arrêterait sur
« relation already exists ».

## Appliquer une nouvelle migration

1. Dashboard Supabase → **SQL Editor**
2. Coller l'intégralité du fichier `.sql`
3. **Run**

Les migrations récentes sont écrites idempotentes (`add column if not exists`,
`create or replace`, `drop … if exists` puis `create`, `on conflict do nothing`) :
les rejouer est sans effet de bord. Écrire toute nouvelle migration sur ce modèle.

## Si un jour on branche la CLI

`supabase link --project-ref <ref>` ne suffit pas. Il faut d'abord déclarer comme
déjà appliquées les 17 versions ci-dessous, sinon le push tente de tout rejouer
et casse :

```
supabase migration repair --status applied <version>   # pour chacune
```

Les versions à utiliser sont celles **d'après le renommage** (voir plus bas) :
`20260530000004` et `20260530000005`, pas `20260530000003`.

## Renommage du 17/07/2026 — collision de versions

Trois fichiers portaient la version `20260530000003`. La table de suivi des
migrations étant indexée par la version et non par le nom de fichier, l'outillage
les considérait comme une seule et même migration : deux des trois n'auraient
jamais été appliquées par un `db push`, silencieusement.

| Avant | Après |
|---|---|
| `20260530000003_articles_editorial_fields.sql` | inchangé |
| `20260530000003_profiles_email_lowercase.sql` | `20260530000004_profiles_email_lowercase.sql` |
| `20260530000003_resources_partenaires_category.sql` | `20260530000005_resources_partenaires_category.sql` |

L'ordre chronologique voulu est préservé et `20260602000001` reste postérieur.
Aucun contenu SQL n'a été modifié.

**Les trois étaient bien appliquées en prod** — vérifié le 17/07/2026 par
introspection (colonnes `articles`, bucket `blog-images`, trigger
`profiles_normalize_email_biu`, contrainte `resources_category_check`). Le
renommage est donc une correction préventive : il n'y a pas de retard
d'application à rattraper.

## État des versions

Ordre d'application. Toutes appliquées en production au 17/07/2026.

```
20260529000001_init_schema
20260529000002_rls_policies
20260529000003_triggers_and_functions
20260529000004_storage_buckets
20260529000005_seed_initial
20260529000006_security_hardening
20260529000007_revoke_trigger_fn_execute
20260529000008_handle_new_user_metadata_and_guard
20260529000009_storage_path_columns
20260529000010_organizations
20260530000001_client_contract_documents_read
20260530000002_contract_documents_access_type
20260530000003_articles_editorial_fields
20260530000004_profiles_email_lowercase          (ex-20260530000003)
20260530000005_resources_partenaires_category    (ex-20260530000003)
20260602000001_show_denis_founder
20260716000001_articles_i18n_en
```

Toute migration créée en aval doit être numérotée **après `20260716000001`**.

## Ne pas confondre avec `supabase/fixes/`

`supabase/fixes/*.sql` sont des scripts one-shot manuels (repositionnement de la
photo d'un fondateur, par ex.), pas des migrations. Les déplacer dans
`migrations/` les ferait rejouer.
