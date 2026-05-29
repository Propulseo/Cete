-- ============================================================================
-- CETé — Migration 4/5 : Buckets Storage + policies storage.objects
-- Source : BACKEND_SPEC.md §7/§9. La RLS des tables NE protège PAS les buckets :
-- les policies vivent sur storage.objects. Convention de chemin : <client_id>/...
-- ============================================================================

insert into storage.buckets (id, name, public) values
  ('certificates',       'certificates',       false),
  ('contract-documents', 'contract-documents', false),
  ('client-documents',   'client-documents',   false)
on conflict (id) do nothing;

-- ── certificates : admin write ; client read si chemin préfixé par son client_id
create policy "certificates_admin_all" on storage.objects
  for all
  using (bucket_id = 'certificates' and public.is_admin())
  with check (bucket_id = 'certificates' and public.is_admin());

create policy "certificates_client_read" on storage.objects
  for select
  using (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = public.current_client_id()::text
  );

-- ── contract-documents : admin only (jamais client) ───────────────────────────
create policy "contract_documents_admin_all" on storage.objects
  for all
  using (bucket_id = 'contract-documents' and public.is_admin())
  with check (bucket_id = 'contract-documents' and public.is_admin());

-- ── client-documents : admin write ; client read 'global/...' ou '<client_id>/...'
create policy "client_documents_admin_all" on storage.objects
  for all
  using (bucket_id = 'client-documents' and public.is_admin())
  with check (bucket_id = 'client-documents' and public.is_admin());

create policy "client_documents_client_read" on storage.objects
  for select
  using (
    bucket_id = 'client-documents'
    and (
      (storage.foldername(name))[1] = 'global'
      or (storage.foldername(name))[1] = public.current_client_id()::text
    )
  );
