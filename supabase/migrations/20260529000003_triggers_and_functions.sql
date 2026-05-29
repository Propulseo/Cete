-- ============================================================================
-- CETé — Migration 3/5 : Triggers, fonctions, vues
-- Source : BACKEND_SPEC.md §4/§6 (durci). slugify SANS unaccent (translate ASCII).
-- ============================================================================

-- ── updated_at automatique ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_clients_updated_at         before update on public.clients         for each row execute function public.set_updated_at();
create trigger trg_profiles_updated_at        before update on public.profiles        for each row execute function public.set_updated_at();
create trigger trg_founders_updated_at        before update on public.founders        for each row execute function public.set_updated_at();
create trigger trg_settings_updated_at        before update on public.settings        for each row execute function public.set_updated_at();
create trigger trg_client_contacts_updated_at before update on public.client_contacts for each row execute function public.set_updated_at();
create trigger trg_evaluations_updated_at     before update on public.evaluations     for each row execute function public.set_updated_at();
create trigger trg_client_documents_updated_at before update on public.client_documents for each row execute function public.set_updated_at();
create trigger trg_resources_updated_at       before update on public.resources       for each row execute function public.set_updated_at();
create trigger trg_articles_updated_at        before update on public.articles        for each row execute function public.set_updated_at();

-- ── handle_new_user : auto-création du profil à l'inscription auth ────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── slugify (translate ASCII, sans unaccent) + clients_set_slug ───────────────
create or replace function public.slugify(v text)
returns text language sql immutable as $$
  select trim(both '-' from regexp_replace(
    lower(translate(
      coalesce(v, ''),
      'àâäáãéèêëíìîïóòôöõúùûüçñÀÂÄÁÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÇÑ',
      'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
    )),
    '[^a-z0-9]+', '-', 'g'
  ));
$$;

create or replace function public.clients_set_slug()
returns trigger language plpgsql as $$
begin
  if new.slug is null or new.slug = ''
     or (tg_op = 'UPDATE' and new.company_name is distinct from old.company_name) then
    new.slug = public.slugify(new.company_name);
  end if;
  return new;
end;
$$;

create trigger trg_clients_set_slug
  before insert or update on public.clients
  for each row execute function public.clients_set_slug();

-- ── profiles_guard_self_edit : anti-escalade (role/client_id/is_active) ───────
create or replace function public.profiles_guard_self_edit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role
       or new.client_id is distinct from old.client_id
       or new.is_active is distinct from old.is_active then
      raise exception 'Interdit: modification de role/client_id/is_active réservée aux admins';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_profiles_guard
  before update on public.profiles
  for each row execute function public.profiles_guard_self_edit();

-- ── set_primary_contact : un seul contact principal par client ────────────────
create or replace function public.set_primary_contact()
returns trigger language plpgsql as $$
begin
  if new.is_primary then
    update public.client_contacts
       set is_primary = false
     where client_id = new.client_id and id <> new.id and is_primary;
  end if;
  return new;
end;
$$;

create trigger trg_set_primary_contact
  before insert or update on public.client_contacts
  for each row execute function public.set_primary_contact();

-- ── Vues d'agrégation (KPI) — security_invoker : respectent la RLS de l'appelant
create view public.v_admin_dashboard_stats with (security_invoker = true) as
select
  (select count(*) from public.profiles where role = 'client' and is_active) as active_clients,
  (select count(*) from public.client_documents)                              as published_documents,
  (select count(*) from public.articles where status = 'published')           as published_articles;

create view public.v_vigi_distribution with (security_invoker = true) as
select vigi_score, count(*)::int as n
from public.evaluations
where status = 'completed' and vigi_score is not null
group by vigi_score;

create view public.v_client_evaluation_counts with (security_invoker = true) as
select client_id, status, count(*)::int as n
from public.evaluations
group by client_id, status;

-- ── Vue publique de vérification de certificat ────────────────────────────────
-- security_invoker OFF (défaut) : la vue contourne la RLS de `certificates` pour
-- exposer aux anon UNIQUEMENT les certificats valides + non expirés, colonnes
-- minimales (jamais client_id ni pdf_storage_path).
create view public.v_certificate_public as
select id, certificate_number, company_name, siren, address, composite_rating,
       vigi_score, vigi_score_tendance, sub_criteria, evaluation_date, validity_date,
       expert_name, status
from public.certificates
where status = 'valide' and validity_date >= current_date;

grant select on public.v_certificate_public to anon, authenticated;
grant select on public.v_admin_dashboard_stats, public.v_vigi_distribution, public.v_client_evaluation_counts to authenticated;
