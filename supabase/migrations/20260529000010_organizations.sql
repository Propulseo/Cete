-- ============================================================================
-- CETé — Migration 10 : table organizations (liste vitrine, éditable par l'admin)
-- Remplace le JSON statique (P1-9). Lecture publique des entrées visibles.
-- ============================================================================
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order int not null default 0,
  visible    boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.organizations enable row level security;

create policy organizations_public_select on public.organizations
  for select using (visible = true);
create policy organizations_admin_all on public.organizations
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.organizations (name, sort_order) values
  ('DR ENEDIS BOURGOGNE', 1),
  ('VINCI ENERGIES', 2),
  ('SER', 3),
  ('SERPOLET', 4),
  ('GREENALP', 5),
  ('ENSIO', 6),
  ('INEO EQUANS', 7),
  ('BBF FIRALP', 8),
  ('SOBECA FIRALP', 9),
  ('SMEE', 10),
  ('BER21', 11),
  ('GUINOT TP', 12)
on conflict (name) do nothing;
