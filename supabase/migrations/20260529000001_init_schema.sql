-- ============================================================================
-- CETé — Migration 1/5 : Schéma initial (13 tables)
-- Source : BACKEND_SPEC.md §2/§3 (durci). gen_random_uuid via pgcrypto (déjà installé).
-- AUCUNE extension activée ici (pg_trgm/unaccent non activés — choix Etienne).
-- ============================================================================

-- ── clients ────────────────────────────────────────────────────────────────
create table public.clients (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  company_name        text not null,
  legal_form          text not null check (legal_form in ('SAS','SARL','SA','EURL','SCI','autre')),
  siret               text not null unique,
  vat_number          text,
  sector              text not null check (sector in ('industrie','tertiaire','logistique','medical','erp_collectif','immobilier','autre')),
  headcount           text,
  address_street      text not null,
  address_postal_code text not null,
  address_city        text not null,
  address_country     text not null default 'France',
  status              text not null default 'onboarding' check (status in ('active','onboarding','paused','archived')),
  contract_start_date date,
  contract_end_date   date,
  internal_notes      text not null default '',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index idx_clients_status on public.clients(status);
create index idx_clients_sector on public.clients(sector);
create index idx_clients_city   on public.clients(address_city);
create index idx_clients_company_name on public.clients(lower(company_name)); -- recherche (trigram différé : pg_trgm non activé)
alter table public.clients enable row level security;

-- ── profiles (extension de auth.users) ───────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text not null default '',
  role       text not null default 'client' check (role in ('admin','client')),
  client_id  uuid unique references public.clients(id) on delete set null, -- 1-1 (décision B1)
  company    text,
  phone      text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_client_id on public.profiles(client_id);
alter table public.profiles enable row level security;

-- ── founders (lecture publique anon ; champs traduits en jsonb {fr,en}) ───────
create table public.founders (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,                                   -- neutre
  role           jsonb not null,                                  -- {fr, en}
  bio            jsonb not null,                                  -- {fr, en}
  specialties    jsonb not null default '{"fr":[],"en":[]}'::jsonb, -- {fr:[], en:[]}
  former_org     jsonb,                                           -- {fr, en}
  current_entity jsonb,                                           -- {fr, en}
  image_url      text not null default '',
  image_position text,
  visible        boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.founders enable row level security;

-- ── settings (singleton ; company + business_hours traduits) ──────────────────
create table public.settings (
  id             int primary key default 1 check (id = 1),
  company        jsonb not null,        -- {fr, en}
  address        text not null,
  city           text not null,
  country        text not null,
  phone          text not null,
  email          text not null,
  website        text not null,
  business_hours jsonb not null,        -- {fr:{...7j}, en:{...7j}}
  map_latitude   numeric,
  map_longitude  numeric,
  updated_at     timestamptz not null default now()
);
alter table public.settings enable row level security;

-- ── client_contacts (1-N depuis clients) ──────────────────────────────────────
create table public.client_contacts (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  first_name text not null,
  last_name  text not null,
  role       text not null,
  email      text,
  phone      text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_client_contacts_client on public.client_contacts(client_id);
create unique index uq_client_contacts_primary on public.client_contacts(client_id) where is_primary; -- un seul principal/client
alter table public.client_contacts enable row level security;

-- ── contract_documents (interne admin ; fichiers → bucket) ────────────────────
create table public.contract_documents (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients(id) on delete cascade,
  type         text not null check (type in ('offer','quote','contract','addendum','resource','report','other')),
  title        text not null,
  version      int not null default 1,
  file_name    text not null,
  file_size    bigint not null default 0,
  mime_type    text not null default 'application/pdf',
  storage_path text,                                  -- bucket contract-documents ; NULL pour lignes historiques
  uploaded_at  timestamptz not null default now(),
  uploaded_by  uuid references public.profiles(id) on delete set null,
  status       text not null default 'draft' check (status in ('draft','sent','signed','archived')),
  notes        text
);
create index idx_contract_documents_client on public.contract_documents(client_id);
create index idx_contract_documents_type   on public.contract_documents(type);
create index idx_contract_documents_status on public.contract_documents(status);
alter table public.contract_documents enable row level security;

-- ── certificates (déposé par admin ; vérif publique via vue) ──────────────────
create table public.certificates (
  id                  uuid primary key default gen_random_uuid(),
  certificate_number  text not null unique,
  client_id           uuid not null references public.clients(id) on delete restrict, -- valeur juridique : pas de hard-delete client
  company_name        text not null,        -- snapshot
  siren               text not null,        -- snapshot
  address             text not null,        -- snapshot
  composite_rating    text not null check (composite_rating ~ '^[A-D]{3}$'),
  vigi_score          text not null check (vigi_score in ('A','B','C','D')),
  vigi_score_tendance text not null default '' check (vigi_score_tendance in ('+','-','')),
  sub_criteria        jsonb not null,       -- ThreeCScore
  evaluation_date     date not null,
  validity_date       date not null,
  expert_name         text not null,
  status              text not null default 'valide' check (status in ('valide','expire','revoque')),
  pdf_storage_path    text,                 -- bucket certificates ; NULL = fallback jsPDF
  created_at          timestamptz not null default now()
);
create index idx_certificates_client on public.certificates(client_id);
create index idx_certificates_status on public.certificates(status);
alter table public.certificates enable row level security;

-- ── evaluations ───────────────────────────────────────────────────────────────
create table public.evaluations (
  id                 uuid primary key default gen_random_uuid(),
  client_id          uuid not null references public.clients(id) on delete restrict, -- préserve l'historique d'audit
  site_name          text not null,
  site_address       text not null,
  visit_date         date not null,
  vigi_score         text check (vigi_score in ('A','B','C','D')),
  omt_score          jsonb,                 -- ThreeCScore (null tant que non complétée)
  composite_rating   text check (composite_rating ~ '^[A-D]{3}$'),
  certificate_id     uuid references public.certificates(id) on delete set null,
  auditor_id         uuid not null references public.founders(id) on delete restrict, -- auditeur = founder
  status             text not null default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled')),
  report_document_id uuid references public.contract_documents(id) on delete set null,
  next_evaluation_due date,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index idx_evaluations_client     on public.evaluations(client_id);
create index idx_evaluations_status     on public.evaluations(status);
create index idx_evaluations_auditor    on public.evaluations(auditor_id);
create index idx_evaluations_visit_date on public.evaluations(visit_date);
alter table public.evaluations enable row level security;

-- ── client_documents (portail client ; ClientScoped) ──────────────────────────
create table public.client_documents (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  category            text not null check (category in ('newsletters','capsules','guides','carnets')),
  type                text not null check (type in ('pdf','video')),
  description         text not null default '',
  file_size           text,
  duration            text,
  upload_date         date not null default current_date,
  url                 text,
  youtube_id          text,
  access_type         text check (access_type in ('view-only','download')),
  visibility          text not null default 'global' check (visibility in ('global','assigned')),
  assigned_client_ids uuid[] not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index idx_client_documents_category on public.client_documents(category);
create index idx_client_documents_assigned on public.client_documents using gin (assigned_client_ids);
alter table public.client_documents enable row level security;

-- ── notifications (ClientScoped ; lu par client via notification_reads) ───────
create table public.notifications (
  id                  uuid primary key default gen_random_uuid(),
  type                text not null check (type in ('veille','document','info')),
  message             text not null,
  date                date not null default current_date,
  visibility          text not null default 'global' check (visibility in ('global','assigned')),
  assigned_client_ids uuid[] not null default '{}',
  created_at          timestamptz not null default now()
);
create index idx_notifications_assigned on public.notifications using gin (assigned_client_ids);
alter table public.notifications enable row level security;

-- ── notification_reads (état lu par utilisateur) ──────────────────────────────
create table public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  read_at         timestamptz not null default now(),
  primary key (notification_id, user_id)
);
alter table public.notification_reads enable row level security;

-- ── resources (ClientScoped) ──────────────────────────────────────────────────
create table public.resources (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  description         text not null,
  category            text not null check (category in ('normes','reglementation','guides','rapports','veille')),
  type                text not null check (type in ('pdf','lien','video')),
  access_type         text not null check (access_type in ('view-only','download')),
  url                 text not null,
  youtube_id          text,
  file_size           text,
  source              text,
  published_date      date,
  visibility          text not null default 'global' check (visibility in ('global','assigned')),
  assigned_client_ids uuid[] not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index idx_resources_category on public.resources(category);
create index idx_resources_assigned on public.resources using gin (assigned_client_ids);
alter table public.resources enable row level security;

-- ── articles (blog admin ; published lisible anon) ────────────────────────────
create table public.articles (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  excerpt        text not null,
  author         text not null,                       -- texte libre (pas de FK)
  category       text not null check (category in ('Expertise','Formation','Réglementation','Sécurité','Innovation')),
  status         text not null default 'draft' check (status in ('published','draft')),
  published_date date,
  views          int not null default 0,
  featured       boolean not null default false,
  video_url      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_articles_status   on public.articles(status);
create index idx_articles_featured on public.articles(featured);
alter table public.articles enable row level security;
