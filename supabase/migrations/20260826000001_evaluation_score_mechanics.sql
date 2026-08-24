-- 20260826000001_evaluation_score_mechanics.sql
-- Moule paramétrique du Vigi-Score (plan Phase 9, décision grill 25/08/2026) :
-- conserve le résultat du moteur de calcul et la justification d'une dérogation.
-- IDEMPOTENTE — à appliquer À LA MAIN dans le SQL Editor Supabase
-- (jamais `supabase db push`, cf. supabase/migrations/README.md).

alter table public.evaluations
  add column if not exists score_details jsonb;

alter table public.evaluations
  add column if not exists score_computed text;

alter table public.evaluations
  add column if not exists score_override_reason text;

-- Aucune policy nouvelle : les colonnes suivent la table existante, dont la RLS
-- est déjà active. Rôle des colonnes :
--   score_details         → entrées de critères + config utilisée (traçabilité)
--   score_computed        → note issue du moteur, avant toute dérogation
--   score_override_reason → justification obligatoire si note ≠ calcul
