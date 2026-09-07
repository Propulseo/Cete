-- ============================================================================
-- CETé — bucket public site-images (images des pages publiques hors blog)
-- ============================================================================

insert into storage.buckets (id, name, public) values
  ('site-images', 'site-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'site_images_public_read'
  ) then
    create policy "site_images_public_read" on storage.objects
      for select
      using (bucket_id = 'site-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'site_images_admin_all'
  ) then
    create policy "site_images_admin_all" on storage.objects
      for all
      using (bucket_id = 'site-images' and public.is_admin())
      with check (bucket_id = 'site-images' and public.is_admin());
  end if;
end $$;
