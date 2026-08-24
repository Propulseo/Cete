-- ============================================================================
-- CETé — Migration : table contact_requests (captation des demandes entrantes)
--
-- Répare le canal commercial : jusqu'ici les deux formulaires publics
-- (contact + demande d'évaluation) affichaient un succès sans rien enregistrer.
-- La trace en base est ce qui garantit qu'aucune demande n'est perdue, même si
-- l'envoi d'email échoue ou n'est pas encore configuré.
--
-- Écriture : service-role uniquement (Server Action src/app/actions/contact.ts,
-- convention du projet pour les écritures privilégiées), donc AUCUNE policy
-- d'insertion — et l'INSERT est révoqué à anon comme à authenticated.
-- Lecture ET suivi (changement de statut) : admin, via la RLS comme partout
-- ailleurs dans ce schéma.
--
-- Principe directeur : une demande ne doit JAMAIS être rejetée par la base.
-- D'où l'absence de NOT NULL sur tout ce qui est facultatif, des plafonds de
-- longueur larges plutôt que des formats stricts, et `ip` en text (une chaîne
-- x-forwarded-for malformée ne doit pas coûter un prospect).
--
-- Idempotente, y compris sur une base où une version antérieure de cette
-- migration aurait déjà tourné (voir la section « rattrapage »).
-- ============================================================================

create table if not exists public.contact_requests (
  id           uuid primary key default gen_random_uuid(),

  -- Quel formulaire a produit la demande.
  kind         text not null constraint contact_requests_kind_chk
                 check (kind in ('contact', 'evaluation')),

  -- Champs communs aux deux formulaires.
  name         text not null,
  email        text not null,
  company      text not null,
  phone        text,

  -- Formulaire « question générale » uniquement. Pas de contrainte sur les
  -- valeurs de `subject` : la liste des sujets vit dans ContactForm.tsx et
  -- bougera. Un check ici ferait perdre des demandes au premier ajout d'option.
  subject      text,
  message      text,

  -- Champs propres au formulaire d'évaluation (fonction, SIREN, secteur,
  -- effectif, type d'évaluation, sites, précisions). En jsonb pour ne pas
  -- multiplier les colonnes nulles côté « contact ».
  -- Pas de plafond de taille ici : contrairement aux colonnes texte, ce jsonb
  -- n'est jamais reçu tel quel — la Server Action le construit champ par champ
  -- à partir d'un schéma zod. Le plafond s'y pose, pas dans la base.
  payload      jsonb not null default '{}'::jsonb,

  -- Contexte de la soumission.
  locale       text not null default 'fr' constraint contact_requests_locale_chk
                 check (locale in ('fr', 'en')),
  user_agent   text,

  -- Suivi commercial.
  status       text not null default 'new' constraint contact_requests_status_chk
                 check (status in ('new', 'handled', 'archived')),

  -- Suivi de l'envoi d'email. email_sent = false + email_error renseigné
  -- signale une demande à traiter à la main : la donnée, elle, est sauve.
  email_sent   boolean not null default false,
  email_error  text,

  created_at   timestamptz not null default now()
);

comment on table public.contact_requests is
  'Demandes entrantes des formulaires publics. Écrites en service-role par la Server Action src/app/actions/contact.ts.';

-- ── Rattrapage : colonnes ajoutées après la première rédaction ───────────────
-- `add column if not exists` plutôt que de les déclarer plus haut : si la table
-- a déjà été créée par une version antérieure du fichier, le `create table if
-- not exists` ci-dessus n'aurait rien fait et ces colonnes manqueraient.

-- Adresse source, pour repérer et bloquer un envoi en rafale. Donnée
-- personnelle : à purger avec le reste (voir la note de conservation en bas).
alter table public.contact_requests add column if not exists ip text;

-- Preuve du consentement CGU. Les deux formulaires imposent la case à cocher ;
-- le RGPD demande de pouvoir le prouver. `default now()` plutôt que NOT NULL
-- sec : la valeur est toujours renseignée, sans jamais bloquer une écriture.
alter table public.contact_requests
  add column if not exists cgu_accepted_at timestamptz not null default now();

-- Dit QUAND une demande est passée en « traitée ». Sans lui, impossible de voir
-- qu'une demande traîne. Alimenté par trg_contact_requests_updated_at.
alter table public.contact_requests
  add column if not exists updated_at timestamptz not null default now();

-- ── Plafonds de longueur ────────────────────────────────────────────────────
-- L'action est appelable publiquement et écrit en service-role (donc hors RLS) :
-- sans plafond, un robot peut déverser des mégaoctets. Nommées et rejouées, pour
-- s'appliquer aussi à une table déjà créée sans elles.
alter table public.contact_requests
  drop constraint if exists contact_requests_name_len_chk,
  drop constraint if exists contact_requests_email_len_chk,
  drop constraint if exists contact_requests_company_len_chk,
  drop constraint if exists contact_requests_phone_len_chk,
  drop constraint if exists contact_requests_subject_len_chk,
  drop constraint if exists contact_requests_message_len_chk,
  drop constraint if exists contact_requests_user_agent_len_chk,
  drop constraint if exists contact_requests_ip_len_chk,
  drop constraint if exists contact_requests_email_error_len_chk;

alter table public.contact_requests
  add constraint contact_requests_name_len_chk        check (length(name) <= 200),
  add constraint contact_requests_email_len_chk       check (length(email) <= 320),
  add constraint contact_requests_company_len_chk     check (length(company) <= 200),
  add constraint contact_requests_phone_len_chk       check (length(phone) <= 40),
  add constraint contact_requests_subject_len_chk     check (length(subject) <= 100),
  add constraint contact_requests_message_len_chk     check (length(message) <= 5000),
  add constraint contact_requests_user_agent_len_chk  check (length(user_agent) <= 500),
  add constraint contact_requests_ip_len_chk          check (length(ip) <= 100),
  add constraint contact_requests_email_error_len_chk check (length(email_error) <= 2000);

-- ── Index ───────────────────────────────────────────────────────────────────
-- Le back-office listera les demandes les plus récentes d'abord, filtrées par statut.
create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);
create index if not exists contact_requests_status_idx
  on public.contact_requests (status);

-- ── Trigger ─────────────────────────────────────────────────────────────────
-- Convention du schéma : trg_<table>_updated_at (cf. migration 3).
drop trigger if exists trg_contact_requests_updated_at on public.contact_requests;
create trigger trg_contact_requests_updated_at
  before update on public.contact_requests
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.contact_requests enable row level security;

-- Lecture et suivi réservés aux admins. Pas de policy d'insertion : seul le
-- service-role écrit, et il contourne la RLS.
drop policy if exists contact_requests_admin_all on public.contact_requests;
create policy contact_requests_admin_all on public.contact_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Droits de table ─────────────────────────────────────────────────────────
-- PostgreSQL vérifie les GRANT AVANT la RLS. Révoquer trop large ici couperait
-- le back-office, qui écrit via le client navigateur (rôle `authenticated`) —
-- tous les repos de src/lib/repo/ passent par @/lib/supabase/client.
--
-- anon : aucun accès, il n'a rien à faire dans cette table.
revoke all on public.contact_requests from anon;
-- authenticated : garde select/update/delete (la RLS is_admin() est la serrure,
-- comme sur les 14 autres tables), mais ne crée jamais une demande lui-même.
revoke insert on public.contact_requests from authenticated;

-- ── Conservation ────────────────────────────────────────────────────────────
-- RGPD : ces lignes contiennent des données personnelles de prospects (nom,
-- email, téléphone, IP). Aucune purge automatique n'est posée ici — la durée
-- de conservation est une décision métier, pas technique. À trancher et à
-- outiller (cron pg_cron ou tâche planifiée) avant la mise en production.
