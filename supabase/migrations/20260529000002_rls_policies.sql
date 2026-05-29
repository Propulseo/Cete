-- ============================================================================
-- CETé — Migration 2/5 : Helpers + politiques RLS
-- Source : BACKEND_SPEC.md §7 (durci). Posture : admin=tout, client=ses données,
-- anon=lectures publiques. WITH CHECK sur toutes les écritures.
-- ============================================================================

-- ── Helpers (security definer, search_path verrouillé) ────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

create or replace function public.current_client_id()
returns uuid language sql stable security definer set search_path = public as $$
  select client_id from public.profiles where id = auth.uid();
$$;

-- ── clients ────────────────────────────────────────────────────────────────
create policy clients_admin_all on public.clients
  for all using (public.is_admin()) with check (public.is_admin());
create policy clients_client_select on public.clients
  for select using (id = public.current_client_id());

-- ── profiles (self read/update ; modif role/client_id bloquée par trigger) ────
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());
create policy profiles_self_select on public.profiles
  for select using (id = auth.uid());
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ── client_contacts ──────────────────────────────────────────────────────────
create policy client_contacts_admin_all on public.client_contacts
  for all using (public.is_admin()) with check (public.is_admin());
create policy client_contacts_client_select on public.client_contacts
  for select using (client_id = public.current_client_id());

-- ── founders (anon : visible uniquement) ──────────────────────────────────────
create policy founders_admin_all on public.founders
  for all using (public.is_admin()) with check (public.is_admin());
create policy founders_public_select on public.founders
  for select using (visible = true);

-- ── settings (lecture publique ; écriture admin) ──────────────────────────────
create policy settings_admin_all on public.settings
  for all using (public.is_admin()) with check (public.is_admin());
create policy settings_public_select on public.settings
  for select using (true);

-- ── contract_documents (admin only) ──────────────────────────────────────────
create policy contract_documents_admin_all on public.contract_documents
  for all using (public.is_admin()) with check (public.is_admin());

-- ── certificates (anon : PAS la table → vue v_certificate_public ; client : own)
create policy certificates_admin_all on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());
create policy certificates_client_select on public.certificates
  for select using (client_id = public.current_client_id());

-- ── evaluations (client : own) ────────────────────────────────────────────────
create policy evaluations_admin_all on public.evaluations
  for all using (public.is_admin()) with check (public.is_admin());
create policy evaluations_client_select on public.evaluations
  for select using (client_id = public.current_client_id());

-- ── client_documents (global OU assigné à ce client) ─────────────────────────
create policy client_documents_admin_all on public.client_documents
  for all using (public.is_admin()) with check (public.is_admin());
create policy client_documents_client_select on public.client_documents
  for select using (
    visibility = 'global' or public.current_client_id() = any(assigned_client_ids)
  );

-- ── notifications (global OU assigné) ─────────────────────────────────────────
create policy notifications_admin_all on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());
create policy notifications_client_select on public.notifications
  for select using (
    visibility = 'global' or public.current_client_id() = any(assigned_client_ids)
  );

-- ── notification_reads (chacun gère son propre lu) ────────────────────────────
create policy notification_reads_admin_all on public.notification_reads
  for all using (public.is_admin()) with check (public.is_admin());
create policy notification_reads_self_select on public.notification_reads
  for select using (user_id = auth.uid());
create policy notification_reads_self_insert on public.notification_reads
  for insert with check (user_id = auth.uid());
create policy notification_reads_self_delete on public.notification_reads
  for delete using (user_id = auth.uid());

-- ── resources (global OU assigné) ─────────────────────────────────────────────
create policy resources_admin_all on public.resources
  for all using (public.is_admin()) with check (public.is_admin());
create policy resources_client_select on public.resources
  for select using (
    visibility = 'global' or public.current_client_id() = any(assigned_client_ids)
  );

-- ── articles (anon : published) ───────────────────────────────────────────────
create policy articles_admin_all on public.articles
  for all using (public.is_admin()) with check (public.is_admin());
create policy articles_public_select on public.articles
  for select using (status = 'published');
