-- ============================================================================
-- CETé — table pillars (section "Nos piliers", ex-JSON statique)
-- ============================================================================

create table if not exists public.pillars (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,        -- {fr, en}
  description jsonb not null,        -- {fr, en}
  icon        text not null,
  color       text not null,
  sort_order  int not null default 999,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.pillars enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'pillars' and policyname = 'pillars_admin_all'
  ) then
    create policy "pillars_admin_all" on public.pillars
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'pillars' and policyname = 'pillars_public_select'
  ) then
    create policy "pillars_public_select" on public.pillars
      for select using (visible = true);
  end if;
end $$;

-- Seed depuis src/data/mocks/{fr,en}/pillars.json (idempotent via id fixe)
insert into public.pillars (id, title, description, icon, color, sort_order) values
  ('00000000-0000-0000-0002-000000000001',
   '{"fr":"Évaluer","en":"Assess"}',
   '{"fr":"Diagnostic terrain structuré. Nous mesurons objectivement votre niveau de maîtrise du risque électrique selon un référentiel propriétaire éprouvé sur 200+ organisations en 20 ans.","en":"Structured field diagnostic. We objectively measure your level of electrical risk control against a proprietary framework proven on 200+ organizations over 20 years."}',
   'zap', 'blue', 1),
  ('00000000-0000-0000-0002-000000000002',
   '{"fr":"Noter","en":"Rate"}',
   '{"fr":"Notation indépendante de AAA à DDD. Un rating transparent, comparable et reconnu qui positionne votre organisation sur une échelle de référence sectorielle.","en":"Independent rating from AAA to DDD. A transparent, comparable and recognized rating that positions your organization on a sector reference scale."}',
   'star', 'yellow', 2),
  ('00000000-0000-0000-0002-000000000003',
   '{"fr":"Accompagner","en":"Support"}',
   '{"fr":"Plan de progression vers le Triple A (AAA). Coaching de groupe ou individualisé, en distanciel ou présentiel, pour améliorer durablement votre notation. Mesure de l''efficience de votre plan de formation.","en":"Progression plan toward Triple A (AAA). Group or individual coaching, remote or in-person, to durably improve your rating. Measures the efficiency of your training plan."}',
   'users', 'green', 3)
on conflict (id) do nothing;
