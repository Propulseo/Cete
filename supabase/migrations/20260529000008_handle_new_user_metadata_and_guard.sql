-- ============================================================================
-- CETé — Migration 8 : handle_new_user lit client_id/company depuis raw_user_meta_data
-- (set au INSERT du profil → évite l'UPDATE bloqué par le guard) ; et le guard
-- profiles_guard_self_edit tolère le backend service-role (auth.uid() null).
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role, client_id, company)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    nullif(new.raw_user_meta_data->>'client_id', '')::uuid,
    new.raw_user_meta_data->>'company'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.profiles_guard_self_edit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- ne bloque QUE les utilisateurs connectés non-admin ; le backend service-role
  -- (auth.uid() null) et les admins peuvent modifier role/client_id/is_active.
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role
       or new.client_id is distinct from old.client_id
       or new.is_active is distinct from old.is_active then
      raise exception 'Interdit: modification de role/client_id/is_active reservee aux admins';
    end if;
  end if;
  return new;
end;
$$;
