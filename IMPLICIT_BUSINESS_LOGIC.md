# Logique métier implicite détectée

> Généré le : 2026-05-29 · Basé sur : `ENTITIES_MAP.md` + `PROJECT_RECON.md` · Lecture seule (aucune modif de code)
> Étape 00.02 (`prompts/00-audit-logique-metier/02-detection-effets-bord`). Scan : dashboards admin/client, pages détail client, repos, génération PDF, ticker notifs, vérif publique.

---

## Résumé exécutif

- **Agrégations / KPI : 11** · **États dérivés : 9** · **Side effects : 11** · **Pages impactées** : admin/dashboard, admin/clients (+ `[id]` société/documents/évaluations), client/dashboard, client/profile, client/* (capsules/carnets/guides/newsletters/ressources), (public)/verifier/[id], admin/blog, admin/documents, admin/ressources, admin/users.
- **Side effect critique** : *Compléter une évaluation* enchaîne 4 mutations **et génère un `certificateId` aléatoire sans créer la ligne `Certificate`** → lien pendant (le `/verifier/[id]` ne trouverait pas le certificat d'une évaluation fraîchement complétée).
- **Correction de relation (vs ENTITIES_MAP)** : `Evaluation.auditorId` → **`Founder`** (la liste d'auditeurs vient de `getFounders()`), **PAS `Profile`**. `ContractDocument.uploadedBy` est codé en dur `"adm-001"`. À reporter dans `BACKEND_SPEC.md`.
- **Dette KPI** : les *trends* du dashboard admin (`+12%`, `+8%`, `+5%`) sont **hardcodés** (faux), pas calculés.
- **Réactivité** : tout est rechargé via `refreshKey`/`loadData` après mutation (pas de cache à invalider en Phase 1) → en Supabase, prévoir invalidation TanStack Query / `revalidatePath`.

---

## Type 1 — Agrégations et KPI

### KPI : Organisations notées
- **Localisation** : `src/lib/repo/stats.repo.ts` (`getAdminStats`) → `AdminStatsGrid` (admin/dashboard).
- **Entité source** : `Profile` (role=client).
- **Formule** : `count(profiles WHERE role='client' AND is_active=true)`.
- **Filtre** : actifs uniquement. **Trend `+12%` = HARDCODÉ** (factice).
- **Reco backend** : RPC/vue `count` (ou `select count head`). Trend : calculer vs période N-1 OU retirer. **Réactivité requise** : oui.

### KPI : Documents publiés
- **Localisation** : `stats.repo` → `AdminStatsGrid`.
- **Source** : `ClientDocument`. **Formule** : `count(client_documents)`. **Trend `+8%` hardcodé.**
- **Reco** : count vue/RPC. **Réactivité** : oui.

### KPI : Articles publiés
- **Localisation** : `stats.repo` → `AdminStatsGrid`.
- **Source** : `Article`. **Formule** : `count(articles WHERE status='published')`. **Trend `+5%` hardcodé.**
- **Reco** : count. **Réactivité** : oui.

### KPI : Notation du portefeuille (distribution Vigi-Score)
- **Localisation** : `src/components/features/admin/VigiDistribution.tsx` (admin/dashboard).
- **Source** : `Evaluation`.
- **Formule** : pour `status='completed' AND vigiScore IS NOT NULL` : `counts[grade]++`, `total++` ; `conformes = A+B` ; `alerte = C+D` ; largeur segment = `counts[g]/total*100`.
- **Reco** : vue d'agrégation `group by vigi_score` filtrée sur completed, OU RPC `get_vigi_distribution()`. **Réactivité** : oui.

### KPI : Cartes clients (4 compteurs)
- **Localisation** : `admin/clients/page.tsx` → `ClientKpiCards`.
- **Source** : `Client`, `Evaluation`.
- **Formules** : `activeCount = count(clients WHERE status='active')` · `scheduledEvals = count(evaluations WHERE status='scheduled')` · `inProgressEvals = count(... 'in_progress')` · `completedEvals = count(... 'completed')`.
- **Reco** : vue/RPC agrégée. **Réactivité** : oui (recalcul après CRUD client/éval).

### KPI : Nombre d'évaluations par client (`evalCounts`)
- **Localisation** : `admin/clients/page.tsx` (useMemo) → colonne table `ClientsTable`.
- **Source** : `Evaluation`. **Formule** : `group by clientId → count`. 
- **Reco** : vue `evaluations_count_by_client` ou `count` corrélé. **Réactivité** : oui.

### KPI : Documents par catégorie (portail client)
- **Localisation** : `DashboardSummary.tsx`.
- **Source** : `ClientDocument` (visibles pour le client). **Formule** : `group by category → count` (newsletters/capsules/guides/carnets).
- **Reco** : calcul front sur la liste déjà filtrée RLS, OU vue. **Réactivité** : non critique.

### KPI : Publications récentes / total (portail client)
- **Localisation** : `DashboardSummary.tsx`. **Formule** : `recentDocs = top 5 documents ORDER BY uploadDate DESC` ; badge `total = documents.length`.
- **Reco** : `order by upload_date desc limit 5` côté requête. **Réactivité** : non.

### KPI : Documents accessibles (profil client)
- **Localisation** : `client/profile/page.tsx` (`totalDocs`). **Source** : `ClientDocument` visibles. **Formule** : `count(documents visibles pour clientId)`.
- **Reco** : count via RLS. **Réactivité** : non.

### KPI : Notifications non lues
- **Localisation** : `notifications.repo` (`getUnreadCount` / `getUnreadCountForClient`). **Formule** : `count(notifications WHERE read=false [AND visible pour client])`.
- **Reco** : count via RLS — ⚠️ dépend du modèle `read` (voir État dérivé + Suspect notifications). **Réactivité** : oui (badge).

### KPI : Activité récente (admin)
- **Localisation** : `AdminRecentActivity` (admin/dashboard, reçoit `documents` + `articles`). **Formule déduite (à confirmer)** : flux des derniers documents + articles triés par date. 🟡 *déduction — non vérifiée ligne à ligne.*
- **Reco** : `union`/vue récente ou 2 requêtes `order by created_at desc limit N`. **Réactivité** : oui.

---

## Type 2 — États dérivés

### État : Certificat expiré / validité
- **Localisation** : `Certificate.status` (`valide`/`expire`/`revoque`) + `validityDate` ; affiché verifier + client CertificateCard.
- **Condition** : aujourd'hui `status` est un **champ stocké** ; or `validityDate < today` devrait dériver « expiré ». **Deux sources de vérité.**
- **Entités** : `Certificate`. **Reco** : statut effectif = `revoque` (manuel) sinon `validityDate < now() ? 'expire' : 'valide'` → colonne `GENERATED` ou vue ; **impacte la RLS publique** (décision A1 : ne montrer que les valides). Job/cron de bascule expire facultatif.

### État : Notification non lue (badge « new »)
- **Localisation** : `NotificationsTicker.tsx`. **Condition** : `!notif.read`. **Entités** : `Notification`. **Reco** : champ `read` (⚠️ par-destinataire, voir Suspect).

### État : Évaluation « complétable »
- **Localisation** : `admin/clients/[id]/evaluations/page.tsx`. **Condition** : `status === 'scheduled' || status === 'in_progress'` → affiche le bouton *Compléter*. **Entités** : `Evaluation`. **Reco** : calcul front sur enum.

### État : Statut client (badge + filtres + KPI)
- **Localisation** : `ClientsTable` / filtres `admin/clients/page.tsx`. **Condition** : `Client.status` direct (active/onboarding/paused/archived) ; pilote `activeCount`, le filtre, et le badge couleur. **Reco** : champ direct + `status_badge`. *Note : « archived » = soft-delete (voir side effect).*

### État : Label Vigi-Score
- **Localisation** : `VigiDistribution` (+ ailleurs). **Condition** : `A→Conforme · B→Progrès attendus · C→Alerte · D→Non conforme`. **Reco** : mapping présentation (front/i18n), pas DB.

### État : Couleur de la note composite
- **Localisation** : `generate-certificate-pdf.ts` (`getRatingColor`) + composant `CompositeRating`. **Condition** : `compositeRating.charAt(0)` → A vert / B jaune / C orange / D rouge. **Reco** : front.

### État : Prochaine évaluation due (`nextEvaluationDue`)
- **Localisation** : calculé à la complétion (`evaluations/page.tsx handleComplete`). **Condition** : `visitDate + 1 an` (stocké au moment de la complétion). **Entités** : `Evaluation`. **Reco** : calcul à l'écriture (trigger/Server Action) — actuellement valeur figée.

### État : Type d'action document (download vs play)
- **Localisation** : `DashboardSummary.handleDocAction`. **Condition** : `type==='video' && youtubeId → open YouTube` sinon `url → open`. **Reco** : front.

### État : Contact principal
- **Localisation** : onglet société. **Condition** : `ClientContact.isPrimary === true`. **Reco** : champ direct (contrainte : un seul primary par client — à valider).

---

## Type 3 — Side effects sur écriture

### Action : Compléter une évaluation ⚠️ (le plus complexe)
- **Localisation** : `admin/clients/[id]/evaluations/page.tsx` → `handleComplete`.
- **Conséquences ordonnées** :
  1. Calcule `compositeRating = autoEval[0] + reqScore[0] + opScore[0]` (ex "BAB").
  2. **Génère `certId` via `Math.random()`** (`cete-cert-{année}-{rand4}-{rand4}`).
  3. `createContractDocument(...)` → insère un document `type='report'`, `status='signed'`, `uploadedBy='adm-001'` (codé en dur), `fileSize` aléatoire, `mimeType='application/pdf'`.
  4. Calcule `nextDue = visitDate + 1 an`.
  5. `updateEvaluation(...)` → `status='completed'`, `vigiScore`, `omtScore` (3C), `compositeRating`, `certificateId=certId`, `reportDocumentId`, `nextEvaluationDue`.
- **⚠️ Manque** : **aucune ligne `Certificate` n'est créée** — `certificateId` pointe dans le vide. Le `/verifier/[certId]` échouerait pour ce certificat.
- **Reco backend** : **RPC/Server Action transactionnelle** : `update evaluations` + `insert contract_documents (report)` + **`insert certificates`** (avec le vrai `certificateNumber`/UUID) + génération & stockage PDF (bucket) + éventuelle notification client. Impacts cascade : VigiDistribution, ClientKpiCards (completedEvals), certificat client, vérif publique, onglet documents.

### Action : Planifier une évaluation
- **Localisation** : `evaluations/page.tsx` → `handleSchedule`. **Conséquences** : `createEvaluation(status='scheduled')`. **Reco** : insert simple ; recalcul KPI (scheduledEvals).

### Action : Marquer notification lue / tout lire
- **Localisation** : `NotificationsTicker` → `markAsRead(id)` ; `markAllAsRead()` (repo). **Conséquences** : `read=true` + maj badge non-lus + maj UI optimiste (`onMarkAsRead`).
- **⚠️** `read` est **global** sur la notif → en `visibility='global'`, marquer lu impacterait tous les clients. **Reco** : table `notification_reads (notification_id, user_id)` OU notif strictement per-client ; RLS par user.

### Action : Créer un client
- **Localisation** : `clients.repo.createClient`. **Conséquences** : dérive `slug` (NFD) + `createdAt/updatedAt` + insert ; recalcul `activeCount` / KPI dashboard. **Reco** : `slug` via trigger/`generated`, `id` UUID, timestamps `default now()`.

### Action : Archiver un client (soft) / Supprimer (hard)
- **Localisation** : `softArchiveClient` (status='archived') ; `deleteClient` (hard delete). **Conséquences hard** : impacte évaluations/contrats/certificats/documents liés (FK). **Reco** : privilégier soft-archive ; `ON DELETE` à définir (CASCADE vs RESTRICT) ; RLS.

### Action : CRUD article (blog admin)
- **Localisation** : `articles.repo` + `admin/blog/page.tsx`. **Conséquences** : create/update/delete ; recalcul « Articles publiés » + Activité récente. **`views` affiché mais jamais incrémenté** → *intention détectée, implémentation absente* (pas de compteur de vues réel).

### Action : Générer le PDF du certificat
- **Localisation** : `generate-certificate-pdf.ts`, appelé depuis `client/CertificateCard.tsx` (téléchargement). **Conséquences** : génère un Blob PDF **à la volée côté client** (jsPDF + QR code). QR → `https://cete-adn.fr/verifier/${cert.id}`.
- **⚠️ incohérences** : domaine QR `cete-adn.fr` ≠ `NEXT_PUBLIC_SITE_URL=cete-notation.fr`. **Reco** : garder client-side OU Edge Function + stockage bucket ; centraliser l'URL de vérif sur l'env.

### Action : Changer le statut d'un certificat
- **Localisation** : `certificates.repo.updateCertificateStatus`. **🟡 Aucun appelant UI trouvé** → *intention/admin action à valider*. **Reco** : action admin (révoquer/réactiver) à câbler ; impacte RLS publique.

### Action : Assigner un document / une ressource à des clients
- **Localisation** : `DocumentFormDialog` / `ResourceFormDialog` (`ClientScoped`: visibility + assignedClientIds). **Conséquences** : visibilité côté portail client (dashboard, listes, profil count). **Reco** : pivot `document_assignments` (ou `uuid[]`) + RLS `visibility='global' OR clientId = ANY(assigned)`. **Point AMBIGU A3** (cf. ENTITIES_MAP #8).

### Action : CRUD documents / ressources / users / settings
- **Localisation** : repos respectifs + pages admin. **Conséquences** : recalcul KPI correspondants (documents publiés, etc.) ; `settings` impacte **aussi la vitrine publique** (footer/contact — décision #6). **Reco** : CRUD admin-only RLS ; `settings` lecture anon.

### Action : Login / Logout
- **Localisation** : `auth.ts` / `auth-context.tsx` / `connexion`. **Conséquences** : hydrate session ; redirection par rôle ; les pages client filtrent par `user.clientId` (⚠️ bug latent `user.id`, décision B1). **Reco** : Supabase Auth + `handle_new_user` trigger (auto-création `profiles`).

---

## Matrice de dépendances inter-pages

| Action | Page d'origine | Pages impactées |
|---|---|---|
| Compléter évaluation | admin/clients/[id]/évaluations | dashboard admin (VigiDistribution), admin/clients (KPI completedEvals + evalCounts), onglet documents (rapport), **certificat client**, **(public)/verifier/[id]** |
| Planifier évaluation | admin/clients/[id]/évaluations | admin/clients (scheduledEvals) |
| Créer / archiver / supprimer client | admin/clients | admin/clients (KPI), dashboard admin (« Organisations notées »), pages client liées |
| Marquer notif lue | client/dashboard (ticker) | badge non-lus (sidebar/dashboard), profil |
| Publier / supprimer article | admin/blog | dashboard admin (« Articles publiés » + Activité récente) |
| Assigner / créer document | admin/documents | client/dashboard (catégories + récents), client/profile (totalDocs), dashboard admin (« Documents publiés ») |
| Modifier settings | admin/settings | **footer + page contact PUBLICS** (décision #6) |
| Modifier founders | admin/team | **vitrine home/à-propos PUBLIQUE** + liste auditeurs (évaluations) |
| Révoquer certificat | (admin, à câbler) | client certificat, **(public)/verifier/[id]** (RLS) |

---

## Points d'attention prioritaires (5 complexités les plus risquées)

1. **🔴 Compléter une évaluation = transaction multi-tables + certificat manquant.** Aujourd'hui : `certificateId` aléatoire sans ligne `Certificate`. Backend : RPC/Server Action transactionnelle (update eval + insert report + **insert certificate** + PDF/bucket + notif). Sinon `/verifier` cassé pour les nouveaux certificats.
2. **🔴 Statut effectif du certificat** (stocké `valide/expire/revoque` **vs** dérivé de `validityDate`). Pilote la **RLS publique anon** (décision A1). Définir la source de vérité (GENERATED/vue + révocation manuelle) avant d'écrire la policy.
3. **🟠 Modèle de lecture des notifications** : `read` global + `ClientScoped` → sémantique « marquer lu » incohérente en multi-tenant. Table `notification_reads` par user, ou notif per-client. Décider en A3.
4. **🟠 Relations d'auditeur / uploadeur** : `Evaluation.auditorId` → **`Founder`** (pas `Profile`) ; `uploadedBy='adm-001'` codé en dur. Clarifier les FK réelles avant le schéma (auditeurs = founders ? table dédiée `auditors` ? colonne sur profiles ?).
5. **🟡 KPI trends factices** (`+12/+8/+5 %`) et **`Article.views` jamais incrémenté** : décider calcul réel (période N-1, compteur de vues) ou suppression — pour ne pas figer du faux dans le schéma.

### Zones où la déduction a été incertaine
- `AdminRecentActivity` : formule exacte du flux (documents+articles) **déduite, non vérifiée ligne à ligne**.
- `updateCertificateStatus` : **aucun appelant UI** → action admin prévue mais non câblée.
- `Article.views` : affiché, **jamais incrémenté** → intention sans implémentation.
- Unicité `ClientContact.isPrimary` (un seul principal par client ?) : supposée, à valider.
- Stratégie PDF certificat (client-side on-demand vs stockage bucket) : à arbitrer en A3.

---

> **Prochaine étape** : `03-spec-backend-complete` → `BACKEND_SPEC.md` (consolide ENTITIES_MAP + ce doc + arbitrages). **EN ATTENTE DE TON GO.** Le commit `feat(supabase): add ENTITIES_MAP and IMPLICIT_BUSINESS_LOGIC` (règle #3) sera proposé à ce moment-là.
