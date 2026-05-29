-- ============================================================================
-- CETé — Migration 6 : Durcissement sécurité (suite get_advisors)
-- ============================================================================

-- search_path fixe sur les fonctions trigger non-definer
alter function public.set_updated_at() set search_path = public;
alter function public.slugify(text) set search_path = public;
alter function public.clients_set_slug() set search_path = public;
alter function public.set_primary_contact() set search_path = public;

-- fonctions trigger SECURITY DEFINER : jamais appelées via l'API REST
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.profiles_guard_self_edit() from anon, authenticated;

-- v_certificate_public : security_invoker (clears ERROR security_definer_view)
-- + accès anon colonne-safe (jamais client_id / pdf_storage_path)
alter view public.v_certificate_public set (security_invoker = on);

revoke select on public.certificates from anon;
grant select (id, certificate_number, company_name, siren, address, composite_rating,
              vigi_score, vigi_score_tendance, sub_criteria, evaluation_date, validity_date,
              expert_name, status)
  on public.certificates to anon;

create policy certificates_anon_verify on public.certificates
  for select to anon
  using (status = 'valide' and validity_date >= current_date);
