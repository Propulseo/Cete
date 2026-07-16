-- Version anglaise des articles de blog (vitrine bilingue).
-- Colonnes optionnelles : la vitrine EN retombe sur le français si NULL/vide.
-- RLS inchangée : les policies existantes (articles_public_select sur
-- status = 'published', écritures admin) couvrent ces nouvelles colonnes.

alter table public.articles
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists content_en text,
  add column if not exists meta_description_en text,
  add column if not exists cover_alt_en text;

comment on column public.articles.title_en is 'Titre anglais (fallback : title)';
comment on column public.articles.excerpt_en is 'Résumé/chapô anglais (fallback : excerpt)';
comment on column public.articles.content_en is 'Corps Markdown anglais (fallback : content)';
comment on column public.articles.meta_description_en is 'Meta description SEO anglaise (fallback : meta_description puis excerpt_en)';
comment on column public.articles.cover_alt_en is 'Texte alternatif anglais de la couverture (fallback : cover_alt)';
