# Audit mock data — vérification de cohérence (B1)

> Généré le : 2026-05-29 · Étape B1 (`04-data-migration/01-audit-mock-data`) en **mode vérification** (pas découverte).
> Base : `ENTITIES_MAP.md` + `BACKEND_SPEC.md` (§13). Lecture seule. Confirme que les mocks couvrent les 13 entités et liste les écarts à traiter au seed.

## Couverture des 13 entités

| Entité (table) | Source mock réelle | Couverture | Écart |
|---|---|---|---|
| clients | `fr/clients.json` (6) | ✅ | ids `cli-*`→uuid ; `country`='FR' vs DEFAULT 'France' |
| profiles | `users.repo.ts` `SEED_USERS` (2) | ✅ | `id`=uuid auth réel (pas `adm-001`/`cli-12345`) — bootstrap via Auth API |
| client_contacts | imbriqué dans `fr/clients.json` | ✅ | à extraire en table ; `contact-*`→uuid |
| founders | `fr/founders.json` + `en/founders.json` (4) | ✅ | **fusion bilingue** `{fr,en}` ; `id` `"1".."4"`→uuid ; `visible` absent (3/4)→true |
| settings | `fr/contact_info.json` + `en/contact_info.json` | ✅ | **fusion bilingue** (`company`/`business_hours`) ; aplatir `maps`→`map_lat/lng` ; `id=1` |
| contract_documents | `fr/contract_documents.json` (18) | ✅ | `uploaded_by="adm-001"`→uuid admin ; pas de fichier réel (`storage_path` NULL) |
| certificates | `certificates.repo.ts` `MOCK_CERTIFICATES` (2) | ⚠️ | seulement 2 certifs ; 3/4 liens éval orphelins → `NULL` (cf. ci-dessous) ; ids texte→uuid |
| evaluations | `fr/evaluations.json` (6) | ✅ | `auditor_id` `"1".."3"`→uuid founder ; `certificate_id` orphelins→NULL |
| client_documents | `client_documents.json` (racine, 12) | ✅ | wrapper `{clientName,clientId,documents,notifications}`→extraire `.documents` |
| notifications | `client_documents.json` (racine, clé `notifications`, 4) | ✅ | `read` supprimé→DROP au seed (état lu démo perdu) |
| notification_reads | *(aucune — nouveau modèle)* | ✅ | table vide au seed |
| resources | `resources.json` (racine, 9) | ✅ | `createdAt`→`created_at` ; `updated_at`=`created_at` |
| articles | `admin_articles.json` (racine, 4) | ✅ | `views` conservé (non incrémenté) |

➡️ **Les 13 entités sont couvertes.** Aucune entité manquante.

## Écarts confirmés (déjà documentés dans BACKEND_SPEC §13)

1. **Source de seed mixte** racine vs `fr/` (PAS « fr/ only ») — cf. §13 tableau.
2. **3/4 `evaluations.certificate_id` orphelins** (`cete-cert-2025-0051-c3d2`, `-0058-e4f1`, `-0045-a1b2` absents) → **`NULL` au seed** (décision Etienne). Seul `cete-cert-2026-0042-a7f3` existe.
3. **Remap ids texte→uuid** global et simultané (toutes FK + `assigned_client_ids`) — dont `uploaded_by=adm-001`, founder ids.
4. **`en/` métier divergents** (`en/evaluations` : clés `omtScore` = `maitriseExigences`/`maitriseOperationnelle` ≠ type) → **supprimer** `en/{clients,evaluations,contract_documents}.json`.
5. **Bilingue** : `founders` (role/bio/specialties/former_org/current_entity) + `settings` (company/business_hours) → `jsonb {fr,en}` (fusion FR+EN).
6. **view-models / aplatissements** : wrapper `client_documents.json`, `contact_info.maps`, double timestamp `resources`.
7. **`notifications.read`** → colonne supprimée (DROP au seed).
8. **`address_country`** : `"FR"` vs DEFAULT `'France'` → normaliser (seed = `'France'`).

## Incohérences de typage (rappel, déjà tranchées)
- `compositeRating` → CHECK `^[A-D]{3}$` · `access_type` `view-only`/`download` OK · casse `pdf`/`video` OK · `auditor_id`→`founders`.

## Synthèse
- **13 tables potentielles** (toutes couvertes) · **12 FK** + 3 `uuid[]` d'assignation · relations validées (cf. ENTITIES_MAP §Relations consolidées).
- **Aucune surprise** vs la spec : l'audit confirme que `BACKEND_SPEC.md` (durci) + §13 couvrent tous les écarts. **Prêt pour B2** (les migrations SQL sont écrites en suivant §2/§3/§7 + §13).

> Le dictionnaire de mapping camelCase↔snake_case complet et les transformations de seed vivent dans `BACKEND_SPEC.md` §13 (source unique).
