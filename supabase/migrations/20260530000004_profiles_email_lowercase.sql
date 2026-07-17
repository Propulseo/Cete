-- ============================================================================
-- CETé — Migration 13 : invariant `profiles.email` en minuscules.
--
-- Le reset de mot de passe (requestPasswordResetAction) recherche le compte par
-- `.eq('email', lower(input))`. GoTrue stocke l'email Auth en minuscules ; sans
-- cet invariant côté `profiles`, un email saisi en casse mixte par l'admin
-- (ex. Jean.Dupont@Acme.fr) désynchronise les deux tables et un compte légitime
-- ET actif se verrait refuser le lien. On garantit donc l'invariant à la source.
-- ============================================================================

-- 1. Backfill des lignes existantes éventuellement en casse mixte.
update public.profiles
set email = lower(email)
where email <> lower(email);

-- 2. Trigger : normalise systématiquement l'email à l'insert et à l'update,
--    quelle que soit la voie d'écriture (handle_new_user, repo, SQL direct…).
create or replace function public.profiles_normalize_email()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.email := lower(new.email);
  return new;
end;
$$;

drop trigger if exists profiles_normalize_email_biu on public.profiles;
create trigger profiles_normalize_email_biu
  before insert or update of email on public.profiles
  for each row execute function public.profiles_normalize_email();
