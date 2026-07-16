-- Denis VUILLOZ : aligner le rôle sur les autres fondateurs + vider la bio
-- (en attendant sa biographie définitive). Colonnes role/bio = jsonb i18n {fr,en}.
-- À exécuter dans le SQL Editor de Supabase.

update public.founders
set
  role = jsonb_build_object(
    'fr', 'Co-fondateur Expert TST et Risques électriques',
    'en', 'Co-founder - Live-Line Work & Electrical Risk Expert'
  ),
  bio = jsonb_build_object('fr', '', 'en', ''),
  updated_at = now()
where name = 'Denis VUILLOZ'
returning id, name, role, bio;
