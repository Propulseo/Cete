-- Catégorie 'partenaires' pour les ressources : liens vers des sites de référence
-- ou partenaires (CTST, INRS, …) affichés dans une section dédiée de la page
-- Ressources de l'espace client. Réutilise l'infrastructure resources existante
-- (type 'lien', visibilité, RLS, formulaire admin).
alter table public.resources drop constraint if exists resources_category_check;
alter table public.resources add constraint resources_category_check
  check (category in ('normes', 'reglementation', 'guides', 'rapports', 'veille', 'partenaires'));
