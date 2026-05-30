-- ============================================================================
-- CETé — Migration 9 : colonnes storage_path manquantes (Lot A — dépôt de fichiers)
-- contract_documents.storage_path et certificates.pdf_storage_path existent déjà
-- (migration 1). On aligne client_documents et resources pour pointer vers un
-- objet Storage (bucket client-documents). NULL = pas de fichier (lien/vidéo, ou
-- contenu legacy via `url`).
-- ============================================================================
alter table public.client_documents add column if not exists storage_path text;
alter table public.resources        add column if not exists storage_path text;
