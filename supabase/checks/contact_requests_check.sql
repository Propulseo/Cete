-- ============================================================================
-- CETé — Vérification : la migration 20260821000002_contact_requests a-t-elle
-- bien été appliquée, et en entier ?
--
-- LECTURE SEULE. Ne crée rien, ne modifie rien, ne supprime rien : ce fichier
-- ne fait qu'interroger le catalogue de PostgreSQL. Le rejouer est sans risque.
--
-- Usage : Dashboard Supabase → SQL Editor → coller tout → Run.
-- Une seule requête, donc un seul résultat : le résumé en première ligne, puis
-- le détail, les manques (❌) remontés en haut.
-- ============================================================================

with checks(bloc, element, ok) as (

  -- ── La table elle-même ────────────────────────────────────────────────────
  select 'table', 'public.contact_requests',
         to_regclass('public.contact_requests') is not null

  -- ── Colonnes (nom + type) ─────────────────────────────────────────────────
  -- Y compris celles ajoutées par la section « rattrapage » de la migration
  -- (ip, cgu_accepted_at, updated_at) : c'est exactement là qu'une base créée
  -- par une version antérieure du fichier serait incomplète.
  union all
  select 'colonne', c.nom || ' (' || c.typ || ')',
         exists (
           select 1 from information_schema.columns
           where table_schema = 'public' and table_name = 'contact_requests'
             and column_name = c.nom and data_type = c.typ
         )
  from (values
    ('id',              'uuid'),
    ('kind',            'text'),
    ('name',            'text'),
    ('email',           'text'),
    ('company',         'text'),
    ('phone',           'text'),
    ('subject',         'text'),
    ('message',         'text'),
    ('payload',         'jsonb'),
    ('locale',          'text'),
    ('user_agent',      'text'),
    ('status',          'text'),
    ('email_sent',      'boolean'),
    ('email_error',     'text'),
    ('created_at',      'timestamp with time zone'),
    ('ip',              'text'),
    ('cgu_accepted_at', 'timestamp with time zone'),
    ('updated_at',      'timestamp with time zone')
  ) as c(nom, typ)

  -- ── Contraintes ───────────────────────────────────────────────────────────
  -- Les trois « check » de valeurs, plus les neuf plafonds de longueur qui
  -- empêchent un robot de déverser des mégaoctets par la Server Action.
  union all
  select 'contrainte', c.nom,
         exists (
           select 1 from pg_constraint
           where conrelid = to_regclass('public.contact_requests')
             and conname = c.nom
         )
  from (values
    ('contact_requests_kind_chk'),
    ('contact_requests_locale_chk'),
    ('contact_requests_status_chk'),
    ('contact_requests_name_len_chk'),
    ('contact_requests_email_len_chk'),
    ('contact_requests_company_len_chk'),
    ('contact_requests_phone_len_chk'),
    ('contact_requests_subject_len_chk'),
    ('contact_requests_message_len_chk'),
    ('contact_requests_user_agent_len_chk'),
    ('contact_requests_ip_len_chk'),
    ('contact_requests_email_error_len_chk')
  ) as c(nom)

  -- ── Index ─────────────────────────────────────────────────────────────────
  union all
  select 'index', i.nom,
         exists (
           select 1 from pg_indexes
           where schemaname = 'public' and tablename = 'contact_requests'
             and indexname = i.nom
         )
  from (values
    ('contact_requests_pkey'),
    ('contact_requests_created_at_idx'),
    ('contact_requests_status_idx')
  ) as i(nom)

  -- ── Trigger updated_at, et la fonction qu'il appelle ──────────────────────
  union all
  select 'trigger', 'trg_contact_requests_updated_at',
         exists (
           select 1 from pg_trigger
           where tgrelid = to_regclass('public.contact_requests')
             and tgname = 'trg_contact_requests_updated_at'
             and not tgisinternal
         )
  union all
  select 'trigger', 'fonction public.set_updated_at()',
         to_regprocedure('public.set_updated_at()') is not null

  -- ── RLS ───────────────────────────────────────────────────────────────────
  union all
  select 'rls', 'row level security activée',
         coalesce((
           select relrowsecurity from pg_class
           where oid = to_regclass('public.contact_requests')
         ), false)
  union all
  select 'rls', 'policy contact_requests_admin_all',
         exists (
           select 1 from pg_policies
           where schemaname = 'public' and tablename = 'contact_requests'
             and policyname = 'contact_requests_admin_all'
         )
  union all
  -- Doit rester VIDE : seul le service-role écrit, et il contourne la RLS.
  select 'rls', 'aucune policy d''insertion',
         not exists (
           select 1 from pg_policies
           where schemaname = 'public' and tablename = 'contact_requests'
             and cmd = 'INSERT'
         )

  -- ── Droits de table ───────────────────────────────────────────────────────
  -- PostgreSQL vérifie les GRANT AVANT la RLS : c'est la première serrure.
  -- to_regclass renvoie NULL si la table manque, et has_table_privilege renvoie
  -- alors NULL plutôt que de faire échouer toute la requête — d'où le coalesce.
  union all
  select 'droits', 'anon : aucun select',
         coalesce(not has_table_privilege('anon', to_regclass('public.contact_requests'), 'select'), false)
  union all
  select 'droits', 'anon : aucun insert',
         coalesce(not has_table_privilege('anon', to_regclass('public.contact_requests'), 'insert'), false)
  union all
  select 'droits', 'authenticated : insert révoqué',
         coalesce(not has_table_privilege('authenticated', to_regclass('public.contact_requests'), 'insert'), false)
  union all
  -- Doit rester VRAI : le back-office lit via le rôle « authenticated », filtré
  -- par is_admin(). Le révoquer couperait l'écran de suivi des demandes.
  select 'droits', 'authenticated : select conservé',
         coalesce(has_table_privilege('authenticated', to_regclass('public.contact_requests'), 'select'), false)
),

resume as (
  select 0 as tri, 'RÉSUMÉ' as bloc, bool_and(ok) as ok,
         case when bool_and(ok)
              then 'Migration appliquée et complète — ' || count(*) || ' vérifications passées.'
              else count(*) filter (where not ok) || ' élément(s) manquant(s) sur ' || count(*)
                   || ' — rejouer supabase/migrations/20260821000002_contact_requests.sql (idempotente).'
         end as element
  from checks
)

select case when ok then '✅' else '❌' end as etat, bloc, element
from (
  select tri, bloc, element, ok from resume
  union all
  select 1, bloc, element, ok from checks
) as t
order by tri, ok, bloc, element;

-- ── Optionnel, à lancer séparément une fois la table confirmée ──────────────
-- Combien de demandes sont déjà arrivées, et quand :
--
--   select kind, status, count(*), max(created_at) as derniere
--   from public.contact_requests group by kind, status order by kind, status;
