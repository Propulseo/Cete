-- 20260826000002_fix_client_select_rls.sql
-- CORRECTIF SÉCURITÉ — audit maison du 25/08/2026 (sonde verify-security-baseline).
--
-- CONSTAT : les politiques *_client_select de client_documents, notifications et
-- resources testent « visibility = 'global' » SANS exiger une session. Or
-- current_client_id() renvoie NULL pour une requête anonyme : la branche globale
-- restait donc VRAIE pour n'importe qui possédant la clé anon publique.
-- Conséquence vérifiée par la sonde : contenus « global » du portail client
-- lisibles sur Internet sans aucun compte.
--
-- CORRECTIF : exiger auth.uid() non nul AVANT les deux branches.
-- IDEMPOTENTE (drop if exists + create) — à appliquer À LA MAIN dans le SQL Editor
-- Supabase (jamais `supabase db push`, cf. supabase/migrations/README.md).
-- Après application : relancer `node scripts/verify-security-baseline.mjs`,
-- attendu : 0 FAILLE.

begin;

drop policy if exists client_documents_client_select on public.client_documents;
create policy client_documents_client_select on public.client_documents
  for select using (
    auth.uid() is not null
    and (
      visibility = 'global'
      or public.current_client_id() = any(assigned_client_ids)
    )
  );

drop policy if exists notifications_client_select on public.notifications;
create policy notifications_client_select on public.notifications
  for select using (
    auth.uid() is not null
    and (
      visibility = 'global'
      or public.current_client_id() = any(assigned_client_ids)
    )
  );

drop policy if exists resources_client_select on public.resources;
create policy resources_client_select on public.resources
  for select using (
    auth.uid() is not null
    and (
      visibility = 'global'
      or public.current_client_id() = any(assigned_client_ids)
    )
  );

commit;
