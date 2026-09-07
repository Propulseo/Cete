-- ============================================================================
-- CETé — page_content_overrides : surcharges de contenu éditées par l'admin.
-- Aucune ligne tant qu'un champ n'a pas été personnalisé : la vitrine continue
-- d'afficher next-intl par défaut (voir resolveText/resolveImage).
-- ============================================================================

create table if not exists public.page_content_overrides (
  page_key   text not null,
  field_key  text not null,
  value      jsonb not null,        -- { "fr": "...", "en": "..." }
  updated_at timestamptz not null default now(),
  primary key (page_key, field_key)
);
alter table public.page_content_overrides enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'page_content_overrides'
      and policyname = 'page_content_overrides_admin_all'
  ) then
    create policy "page_content_overrides_admin_all" on public.page_content_overrides
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'page_content_overrides'
      and policyname = 'page_content_overrides_public_select'
  ) then
    create policy "page_content_overrides_public_select" on public.page_content_overrides
      for select using (true);
  end if;
end $$;
