-- Restriction d'accès par document sur les contrats & rapports.
-- 'download'  : le client peut consulter, télécharger et imprimer (comportement historique).
-- 'view-only' : le client peut seulement consulter (téléchargement/impression bridés côté UX).
-- Défaut 'download' => les documents existants restent téléchargeables (rétro-compatible).
-- NB : ce champ pilote l'UI client ; la protection réelle du fichier reste assurée par les
--      RLS Storage (URL signées). Un mode "lecture seule" web n'est pas inviolable.

alter table public.contract_documents
  add column if not exists access_type text not null default 'download'
  check (access_type in ('view-only', 'download'));
