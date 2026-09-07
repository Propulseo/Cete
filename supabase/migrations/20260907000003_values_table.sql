-- ============================================================================
-- CETé — table values (section "Nos valeurs", ex-JSON statique)
-- ============================================================================

create table if not exists public.values (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,        -- {fr, en}
  description jsonb not null,        -- {fr, en}
  icon        text not null,
  sort_order  int not null default 999,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.values enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'values' and policyname = 'values_admin_all'
  ) then
    create policy "values_admin_all" on public.values
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'values' and policyname = 'values_public_select'
  ) then
    create policy "values_public_select" on public.values
      for select using (visible = true);
  end if;
end $$;

-- Seed depuis src/data/mocks/{fr,en}/values.json (idempotent via id fixe)
insert into public.values (id, title, description, icon, sort_order) values
  ('00000000-0000-0000-0001-000000000001',
   '{"fr":"Indépendance","en":"Independence"}',
   '{"fr":"Aucun lien commercial avec les prestataires ou fournisseurs évalués. Notre notation est libre de tout conflit d''intérêt.","en":"No commercial ties to the vendors or providers being assessed. Our rating is free of any conflict of interest."}',
   'shield', 1),
  ('00000000-0000-0000-0001-000000000002',
   '{"fr":"Confidentialité","en":"Confidentiality"}',
   '{"fr":"Vos données, vos résultats et votre notation restent strictement confidentiels. Communication anonymisée sur demande.","en":"Your data, results and rating remain strictly confidential. Anonymized communication available on request."}',
   'lock', 2),
  ('00000000-0000-0000-0001-000000000003',
   '{"fr":"Objectivité","en":"Objectivity"}',
   '{"fr":"Référentiel structuré, critères mesurables, méthodologie reproductible. Chaque notation repose sur des faits, pas sur des impressions.","en":"Structured framework, measurable criteria, reproducible methodology. Every rating is based on facts, not impressions."}',
   'heart', 3),
  ('00000000-0000-0000-0001-000000000004',
   '{"fr":"Progression","en":"Progression"}',
   '{"fr":"La notation n''est pas une sanction. C''est un point de départ. Chaque organisation peut progresser vers le AAA avec un accompagnement adapté.","en":"The rating is not a penalty. It is a starting point. Every organization can progress toward AAA with the right support."}',
   'target', 4)
on conflict (id) do nothing;
