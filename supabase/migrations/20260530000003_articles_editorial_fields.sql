-- ============================================================================
-- CETé — Articles éditoriaux : corps Markdown, slug stable, image de couverture
-- Rend possible la rédaction d'un article complet en admin (corps + couv) et son
-- affichage sur la vitrine. Additif & non destructif. Bucket public dédié aux
-- images de couverture (la vitrine est servie en anonyme → lecture publique).
-- ============================================================================

-- ── Nouvelles colonnes (idempotent) ───────────────────────────────────────────
alter table public.articles add column if not exists slug             text;
alter table public.articles add column if not exists content          text;          -- corps Markdown
alter table public.articles add column if not exists cover_image      text;          -- URL publique (bucket blog-images) ou externe
alter table public.articles add column if not exists cover_alt        text;
alter table public.articles add column if not exists author_role      text;
alter table public.articles add column if not exists meta_description  text;          -- SEO (fallback excerpt)
alter table public.articles add column if not exists read_minutes     int;           -- temps de lecture (sinon estimé)

-- ── Backfill slug depuis le titre (sans désaccentuation : édition possible en admin)
update public.articles
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

-- ── Unicité du slug (partielle : ignore les éventuels null) ────────────────────
create unique index if not exists idx_articles_slug on public.articles(slug) where slug is not null;

-- ── Bucket public pour les couvertures de blog ────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- ── Policies storage.objects : lecture publique, écriture admin ───────────────
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'blog_images_public_read'
  ) then
    create policy "blog_images_public_read" on storage.objects
      for select
      using (bucket_id = 'blog-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'blog_images_admin_all'
  ) then
    create policy "blog_images_admin_all" on storage.objects
      for all
      using (bucket_id = 'blog-images' and public.is_admin())
      with check (bucket_id = 'blog-images' and public.is_admin());
  end if;
end $$;
