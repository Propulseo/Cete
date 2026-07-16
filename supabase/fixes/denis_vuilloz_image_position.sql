-- Denis VUILLOZ : cadrage de la photo (dézoomée, remontée).
-- Sa photo est un selfie où il est décalé à droite ; le cadrage par défaut
-- (object-top) coupait le menton sur les tuiles carrées.
--   65% (horizontal) -> recentre sur son visage, décalé à droite dans l'original
--   62% (vertical)   -> remonte la photo : moins de ciel en haut, épaules visibles
-- image_position = colonne texte (object-position CSS).
-- À exécuter dans le SQL Editor de Supabase.

update public.founders
set
  image_position = '65% 62%',
  updated_at = now()
where name = 'Denis VUILLOZ'
returning id, name, image_url, image_position;
