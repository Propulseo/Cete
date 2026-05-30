-- ============================================================================
-- CETé — Migration 11 : Lecture client de SES documents contractuels
-- ----------------------------------------------------------------------------
-- Contexte : contract_documents était admin-only (CRM interne). Le portail client
-- n'avait donc aucune vue sur les rapports d'évaluation / contrats que l'admin
-- dépose dans l'onglet « Documents » de la fiche client. Décision produit
-- (2026-05-30) : le client doit voir SES rapports + contrats signés (page portail
-- « Mes documents »). On ajoute donc :
--   1. une policy SELECT table   → le client lit ses lignes "client-facing" ;
--   2. une policy SELECT storage → le client télécharge le fichier associé.
--
-- Filtre client-facing = type ∈ {report, contract, addendum} ET statut ∈ {sent, signed}.
-- Les internes (offer/quote/resource/other, brouillons, archivés) restent invisibles.
-- La policy admin existante (contract_documents_admin_all) n'est PAS touchée : les
-- policies SELECT sont permissives (OR) → l'admin garde l'accès total.
-- ============================================================================

-- ── Table : contract_documents — lecture client restreinte ───────────────────
create policy contract_documents_client_select on public.contract_documents
  for select using (
    client_id = public.current_client_id()
    and type in ('report', 'contract', 'addendum')
    and status in ('sent', 'signed')
  );

-- ── Storage : bucket contract-documents — lecture client de son propre dossier ─
-- Convention de chemin : <client_id>/<uuid>-<fichier> (cf. buildStoragePath côté UI).
-- Mirroir de la policy certificates_client_read (migration 4). Les métadonnées des
-- documents internes restent masquées par la RLS table ci-dessus ; le chemin storage
-- porte un UUID non devinable. L'admin conserve son accès via contract_documents_admin_all.
create policy "contract_documents_client_read" on storage.objects
  for select
  using (
    bucket_id = 'contract-documents'
    and (storage.foldername(name))[1] = public.current_client_id()::text
  );
