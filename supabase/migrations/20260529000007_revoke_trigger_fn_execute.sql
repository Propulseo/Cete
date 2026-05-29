-- ============================================================================
-- CETé — Migration 7 : révoquer EXECUTE de PUBLIC sur les fonctions trigger-only
-- (le revoke anon/authenticated de la migration 6 était inopérant : EXECUTE est
--  accordé à PUBLIC par défaut ; anon/authenticated en héritent. Il faut révoquer
--  de PUBLIC.) handle_new_user / profiles_guard_self_edit ne sont JAMAIS appelées
--  via l'API REST — uniquement comme triggers (exécution système, pas de check EXECUTE).
-- Note : is_admin() / current_client_id() restent exécutables (requis par les
--  policies RLS ; ne renvoient que le statut de l'appelant — WARN advisor accepté).
-- ============================================================================
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.profiles_guard_self_edit() from public;
