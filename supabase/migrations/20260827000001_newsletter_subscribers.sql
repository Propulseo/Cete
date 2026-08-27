-- ============================================================================
-- CETé — Migration : table newsletter_subscribers (inscription newsletter blog)
--
-- Ferme le dernier des huit trous du HANDOFF : le bouton « S'inscrire à la
-- newsletter » ne faisait que renvoyer vers /contact, sans capter aucun email.
--
-- Même principe qu'en Phase 1 (contact_requests) : la base d'abord, Brevo
-- ensuite — un abonné n'est jamais perdu par une panne de l'API Brevo. Le
-- couple brevo_synced/brevo_error trace la synchronisation, à l'identique de
-- email_sent/email_error sur contact_requests.
--
-- Écriture : service-role uniquement (Server Action src/app/actions/newsletter.ts),
-- donc AUCUNE policy d'insertion — l'INSERT est révoqué à anon comme à authenticated.
--
-- Idempotente.
-- ============================================================================

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),

  email         text not null unique
                  constraint newsletter_subscribers_email_len_chk check (length(email) <= 320),

  locale        text not null default 'fr'
                  constraint newsletter_subscribers_locale_chk check (locale in ('fr', 'en')),

  -- Preuve du consentement RGPD (case non pré-cochée, cf. BlogCTA.tsx).
  consented_at  timestamptz not null default now(),

  -- Suivi de la synchronisation Brevo. brevo_synced = false + brevo_error
  -- renseigné signale un abonné à resynchroniser à la main : la donnée, elle,
  -- est déjà sauve.
  brevo_synced  boolean not null default false,
  brevo_error   text constraint newsletter_subscribers_brevo_error_len_chk check (length(brevo_error) <= 2000),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.newsletter_subscribers is
  'Inscriptions à la newsletter du blog. Écrites en service-role par la Server Action src/app/actions/newsletter.ts.';

-- ── Index ───────────────────────────────────────────────────────────────────
create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

-- ── Trigger ─────────────────────────────────────────────────────────────────
-- Convention du schéma : trg_<table>_updated_at.
drop trigger if exists trg_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger trg_newsletter_subscribers_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.newsletter_subscribers enable row level security;

-- Lecture et suivi réservés aux admins. Pas de policy d'insertion : seul le
-- service-role écrit, et il contourne la RLS.
drop policy if exists newsletter_subscribers_admin_all on public.newsletter_subscribers;
create policy newsletter_subscribers_admin_all on public.newsletter_subscribers
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Droits de table ─────────────────────────────────────────────────────────
revoke all on public.newsletter_subscribers from anon;
revoke insert on public.newsletter_subscribers from authenticated;

-- ── Conservation ────────────────────────────────────────────────────────────
-- RGPD : email + horodatage de consentement. Conservation tant que l'abonné ne
-- se désinscrit pas (lien de désinscription Brevo natif) — pas de purge
-- automatique posée ici, à l'identique de contact_requests.
