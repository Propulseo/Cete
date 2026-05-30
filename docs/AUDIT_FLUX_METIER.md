# Audit flux métier CETé — dans la peau du chef d'entreprise

> Scan page par page (admin + client + vitrine), réalisé après la migration Supabase.
> Objectif : vérifier que le quotidien d'un dirigeant qui gère **beaucoup de dossiers**
> fonctionne réellement. Verdict : le **socle CRUD est solide et branché Supabase**, mais
> **3 piliers du métier manquent** (dépôt de fichiers, accès clients, dépôt de certificat).

## Le parcours métier, et où il casse

| Étape (vie du dirigeant) | État | Blocage |
|---|---|---|
| 1. Créer une entreprise cliente | ✅ marche | — |
| 2. **Lui ouvrir un accès email/mdp** | ❌ | aucun lien compte↔entreprise dans l'UI |
| 3. Planifier une évaluation (auditeur, date) | ✅ marche | — |
| 4. Saisir la note (Vigi/3C/composite) | ⚠️ | champs libres non validés, tronqués à la 1ʳᵉ lettre |
| 5. **Déposer le rapport (PDF)** | ❌ | faux fichier (taille aléatoire), rien n'est stocké |
| 6. **Déposer le certificat (PDF)** | ❌ | flux totalement absent (pas d'écran, pas de `create`) |
| 7. Publier/assigner des documents & ressources | ⚠️ | métadonnées seulement ; ressources non assignables |
| 8. Côté client : se connecter | ✅ marche | — |
| 9. Côté client : télécharger ses pièces | ❌ | liens 404 (sauf certificat jsPDF) |
| 10. Côté client : gérer son profil/mot de passe | ❌ | profil lecture seule |

---

## 🔴 P0 — Bloquant (le besoin explicite du dirigeant)

### P0-1. Dépôt de fichiers inexistant — Supabase Storage mort
Aucun code n'utilise Storage (`.storage`/`.upload()`/URL signée = 0 dans tout `src/`). Les 3 buckets
(`contract-documents`, `certificates`, `client-documents`) et les colonnes cibles
(`contract_documents.storage_path`, `certificates.pdf_storage_path`) existent mais ne sont **jamais alimentés**.
- L'unique `<input type="file">` (`admin/clients/[id]/documents/page.tsx:154`) ne lit que `name`/`size` et **jette le binaire** ; sans fichier choisi, il invente un nom + une **taille aléatoire** (`Math.random()`).
- La clôture d'évaluation crée un faux rapport `report` à **taille aléatoire** (`admin/clients/[id]/evaluations/page.tsx:91`).
- Saisie document/ressource = **URL texte** + taille texte (`DocumentFormDialog.tsx:144-151`, `ResourceFormDialog.tsx:184-202`).
- Côté client, tous les « Télécharger » PDF → **404** (`DocumentsList.tsx:141`, `ResourceCard.tsx:67` ; ni Storage ni `public/docs|resources/`).
- **Impact :** le dirigeant croit déposer contrats/rapports/pièces ; rien n'est hébergé ni re-téléchargeable.

### P0-2. Ouvrir un accès client (email/mdp) — lien compte ↔ entreprise absent de l'UI
- Choisir **email + mot de passe** à la création d'un **compte** marche (`UserFormDialog.tsx:84-106` → `createUserAction` service-role, vrai compte Auth). ✅
- **MAIS** `UserFormDialog` n'expose **aucun sélecteur d'entreprise cliente** — juste un champ texte « Entreprise » décoratif (`:120-128`). `clientId` n'est jamais renseigné → le compte client est créé avec `client_id = NULL`.
- Créer une **entreprise** (`ClientFormDialog`) ne propose **jamais** d'ouvrir son accès. Les deux parcours (Clients / Utilisateurs) sont cloisonnés.
- **Impact :** un compte client créé n'est rattaché à aucune fiche → son espace est **vide** (`profile/page.tsx:34` retombe sur `user.id`). Le modèle « 1 client = 1 compte » est non opérationnel sans édition manuelle en base.

### P0-3. Dépôt de certificat par l'admin — flux produit totalement absent
- Aucun écran certificat, aucun `createCertificate` (`certificates.repo.ts` n'a que des lectures + `updateCertificateStatus`).
- La clôture d'évaluation **n'émet jamais de certificat** (`evaluation.certificateId` reste vide).
- Côté client, le certificat est **généré en mémoire (jsPDF)** au clic (`CertificateCard.tsx:39-53` → `generate-certificate-pdf.ts`), jamais stocké ; le QR de la carte est un placeholder Lucide (`CertificateCard.tsx:111`).
- Les certificats visibles aujourd'hui (carte client + `/verifier`) ne viennent **que du seed SQL**.
- **Impact :** le flux explicite « l'admin dépose le certificat pour que le client le télécharge » n'existe pas.

### P0-4. Aucun changement / reset de mot de passe
- Profils admin & client = **lecture seule** (`client/profile/page.tsx`, pas de page profil admin).
- Aucun `auth.updateUser` / `resetPasswordForEmail` dans tout `src/`. Pas de « mot de passe oublié ».
- En **édition** d'utilisateur, le champ mdp est masqué (`UserFormDialog.tsx:94`) et `updateUser` ignore le mdp (`users.repo.ts:75`).
- **Impact :** un mot de passe perdu = compte irrécupérable (sauf suppression/recréation par l'admin).

---

## 🟠 P1 — Majeur (marche partiellement / trompeur)

### P1-5. Le blog admin n'atteint pas la vitrine
Le blog public rend un tableau **codé en dur** (`(public)/blog/page.tsx:16`) ; `[slug]` est statique. Aucun `listArticles`.
→ Tout article publié dans l'admin est **invisible** sur le site.
*(Distinguer : depuis la frontière §6, les **fondateurs** (`HomeFounders`/`AboutFounders`) et les **coordonnées** (`Footer`/`ContactMain`) reflètent désormais bien la DB. `FoundersGrid`/`ContactInfo`/`ContactMap` sont du code mort sur JSON.)*

### P1-6. Édition bilingue → destruction silencieuse de l'anglais
`founders` et `settings` dupliquent **FR→EN** à l'écriture (`founders.repo.ts:55-62`, `settings.repo.ts:40-51`) et les formulaires n'éditent que le FR. Corriger une bio / un rôle / les horaires **écrase la version EN**. Pour un site FR/EN, perte de données.

### P1-7. Assignation documents limitée ; ressources non assignables
- Documents : assignation à **un seul** client (`DocumentFormDialog.tsx:198-204`) alors que le schéma est multi (`assigned_client_ids uuid[]`).
- **Ressources : aucun champ visibilité/client** (`ResourceFormDialog`) → toute ressource est **forcément globale** ; impossible d'en réserver une à un client (pourtant supporté par DB + repo).
- Risque cohérence : option stockée `c.clientId ?? c.id` (`DocumentFormDialog.tsx:209`) vs RLS `current_client_id()` → si `clientId` absent, assignation invisible côté client.

### P1-8. Évaluations : saisie 3C fragile + non exposées au client
- 3C = champs texte libres non validés, **tronqués à la 1ʳᵉ lettre** pour le composite (`evaluations/page.tsx:87,220-222`) → « B+ » devient « B ». Risque de notation incohérente.
- Le client ne voit **jamais** le détail de ses évaluations/rapports (`listEvaluationsByClientId` existe mais n'est appelé par aucune page client).
- Pas de transition `in_progress`, pas de ré-édition d'une éval `completed`, suppression non câblée.

### P1-9. Contrôles « factices » qui affichent un faux succès
- **Organisations** : `useState` volatil, **zéro persistance** (perdu au reload) malgré « affichées sur le site » (`organizations/page.tsx`).
- **Bouton « Réinitialiser » des Réglages** : `resetSettings()` est un **no-op** (`settings.repo.ts:69-71`) mais affiche « Paramètres réinitialisés ».

### P1-10. Fondateurs : pas de création/suppression
Seuls édition + toggle visibilité existent (pas de `createFounder`/`deleteFounder`). Photo = champ texte `imageUrl` (pas d'upload).

---

## 🟡 P2 — Finition / robustesse / passage à l'échelle

- **Pas de pagination ni tri colonne** sur clients / documents / ressources (tout chargé + filtré en mémoire). La liste clients fait un **double full-scan** (clients + *toutes* les évaluations) à chaque ouverture (`admin/clients/page.tsx:50-54`). Ne tient pas un gros portefeuille.
- **Suppressions sans confirmation** (documents, ressources, articles…) → suppression définitive en 1 clic *(a déjà effacé 5 documents seedés pendant les tests)*.
- Catégorie blog **« Expertise » absente** du formulaire (`ArticleFormDialog.tsx:120-124`) alors qu'autorisée par le CHECK DB.
- `updateUser` met à jour `profiles.email` mais **pas** `auth.users` → email de connexion désynchronisé.
- Badge « non-lus » du sidebar non rafraîchi après marquage lu (`client/layout.tsx:44`).
- Filtrage documents côté client repose à 100 % sur la RLS (`documents.repo.ts:69-84` ignore son paramètre `clientId`) — étanche mais asymétrique vs notifications/resources.
- mdp < 6 caractères → remplacé en silence par `"changeme123"` (`users.repo.ts:51`, hors UI).
- Double saisie YouTube URL + ID incohérente entre les 2 formulaires.

---

## Ce qui marche bien (à ne pas casser)
- Auth + routage par rôle (`auth.ts`, `connexion`).
- CRUD branché Supabase : clients (+contacts), documents, ressources, articles, fondateurs (édit), réglages.
- Dossier client à onglets (vue d'ensemble / société / documents / évaluations).
- Planification + clôture d'évaluation (note Vigi/3C/composite, statut, prochaine éval).
- Visibilité client **étanche par RLS** (`current_client_id()`), notifications + marquage « lu » persistant.
- Certificat client téléchargeable en PDF (jsPDF) — seul download réellement fonctionnel.
- Dashboard : KPI + VigiDistribution + activité récente **réels** (DB).
- Frontière §6 : fondateurs + coordonnées de la vitrine alimentés par la DB.

---

## Roadmap de remédiation proposée (priorisée)

**Lot A — Dépôt de fichiers (P0-1, base de P0-3 / P1-10)**
Composant d'upload réutilisable → Supabase Storage ; download via URL signée ; brancher documents, rapports d'évaluation, photos fondateurs.

**Lot B — Accès clients (P0-2, P0-4)**
Sélecteur d'entreprise dans `UserFormDialog` + bouton « Ouvrir un accès » depuis la fiche client ; redéfinition de mdp par l'admin ; self-service changement email/mdp + « mot de passe oublié ».

**Lot C — Dépôt de certificat (P0-3)**
Écran de dépôt (saisie infos + upload PDF) → `createCertificate` + lien évaluation→certificat ; suppression du QR placeholder.

**Lot D — Cohérence vitrine & contenu (P1-5, P1-6, P1-9)**
Blog public depuis la DB ; édition bilingue (ou champ EN) founders/settings ; persistance organisations ; retrait/clarification du bouton « Réinitialiser ».

**Lot E — Robustesse & volume (P1-7, P1-8, P2)**
Assignation multi-clients + ressources assignables ; validation 3C + vue évaluations client ; pagination/tri ; confirmations de suppression.

---

## ✅ Remédiation des 3 P0 (faite)

**Lot A — Dépôt de fichiers (P0-1)** — Supabase Storage branché.
- Migration `..009_storage_path_columns` (storage_path sur client_documents + resources) ; helper `src/lib/supabase/storage.ts` (upload / URL signée / delete, chemins `<client_id>|global/`) ; composant `FileUploadField`.
- Upload réel câblé : dossier client (`contract_documents`), documents portail (`DocumentFormDialog`), ressources PDF (`ResourceFormDialog`). Plus de faux fichier à taille aléatoire ; le rapport d'évaluation devient un brouillon que l'admin remplit avec le vrai PDF.
- Téléchargements par **URL signée** : table docs admin, portail client (`DocumentsList`, `DocumentCard`, `ResourceCard`).
- Vérif : `scripts/verify-storage.mjs` → **13/13 PASS** (upload + URL signée + fetch + cleanup sur les 3 buckets, RLS admin).

**Lot B — Accès clients (P0-2, P0-4)** — modèle « 1 client = 1 compte » opérationnel.
- `UserFormDialog` : sélecteur d'**entreprise cliente** (renseigne `profiles.client_id`) au lieu d'un champ texte décoratif.
- Carte « Accès au portail client » dans la fiche client (`ClientAccessCard`) : *Ouvrir un accès* (email+mdp pré-rattaché) ou voir l'accès actif + réinitialiser le mdp.
- Mots de passe : redéfinition par l'admin (Admin API `updateUserById`, + email synchronisé) ; self-service client (`AccountSettingsCard` → `auth.updateUser`) ; **mot de passe oublié** (lien connexion → `resetPasswordForEmail` + page `/reset-password`).

**Lot C — Dépôt de certificat (P0-3)** — flux produit complété.
- `certificates.repo.createCertificate` + `pdf_storage_path` ; `CertificateFormDialog` (infos préremplies depuis l'évaluation + upload PDF optionnel vers le bucket `certificates`).
- Depuis une évaluation complétée : bouton **« Déposer le certificat »** → crée le certificat + lie `evaluation.certificate_id`. Le portail client télécharge le PDF officiel déposé (sinon fallback jsPDF).

Vérif globale : `tsc` ✅ · `npm run build` ✅ · `lint:lines` ✅ · Storage 13/13 ✅.

---

## ✅ Remédiation des P1 (faite)

- **P1-5 Blog → vitrine** : lecteurs serveur `loadPublishedArticles` / `loadArticleBySlug` (vitrine-data, RLS `published`). `/blog` liste les articles publiés DB (brouillons exclus) ; `/blog/[slug]` rend l'article DB (excerpt + vidéo) ou l'article éditorial sur-mesure. *Limite : pas de corps riche en DB (excerpt fait office d'intro) — colonne `content` = amélioration future.* Vérifié runtime (4 publiés affichés, 2 brouillons absents, détail HTTP 200).
- **P1-6 Plus d'écrasement EN** : `founders.repo` + `settings.repo` font un **read-then-merge** (préservent la valeur EN existante au lieu de la remplacer par le FR). Édition EN dédiée = amélioration future.
- **P1-7 Assignation** : `DocumentFormDialog` → **multi-clients** (cases à cocher, cible `clients.id`) ; `ResourceFormDialog` → ajout **visibilité + clients** (était impossible). Upload : 1 client → dossier isolé, multi → `global/`.
- **P1-8 Évaluations** : validation de la saisie 3C (`^[A-D][+-]?$`) à la clôture ; nouvelle carte **« Mes évaluations »** sur le dashboard client (`ClientEvaluationsCard`, RLS self-scope).
- **P1-9 Organisations** : migration 010 (table `organizations` + RLS + seed) ; repo + page admin **persistante** (add/remove en DB, confirmation) ; vitrine `loadOrganizations` → prop `HomeOrganizations`. Bouton « Réinitialiser » no-op **retiré** des réglages.
- **P2** : catégorie blog **« Expertise »** ajoutée ; **confirmations de suppression** (documents, ressources, blog, comptes, docs contractuels, organisations).

Vérif : `tsc` ✅ · `npm run build` ✅ · `lint:lines` ✅ · runtime blog/organisations ✅.

**Restent (P2 / amélioration)** : pagination & tri des listes (clients/documents/ressources), corps d'article riche (`content`), édition bilingue dédiée (champs EN), fonts/SMTP custom (Brevo) pour emails Auth.

---

## ✅ Flux documents admin → client (clarifié & complété)

Diagnostic : le client **voit déjà** parfaitement ses documents/ressources via la RLS (vérifié : 3 docs globaux + 8 ressources dont 1 assignée). Le problème était **ergonomique** — 3 emplacements distincts mal différenciés :

1. **Admin → Documents** : publie des `client_documents` (catégorie = page client), `global` (tous) ou assignés. → pages client `/client/{newsletters,capsules,guides,carnets}`.
2. **Dossier client → onglet « Documents »** : `contract_documents` = contrats/devis/rapports **internes**, **jamais** visibles par le client (RLS admin-only). C'est là que l'on déposait par erreur en attendant que le client voie.
3. **Dossier client → onglet « Espace client » (NOUVEAU)** : publie des `client_documents` **auto-assignés à CE client**, par catégorie. Le client les voit immédiatement sur la page correspondante.

Ajouts : `documents.repo.listAssignedToClient`, `DocumentFormDialog` prop `lockedClientId` (assignation verrouillée), page `/admin/clients/[id]/espace` + onglet. Vérifié runtime : `scripts/verify-publish-to-client.mjs` → **5/5 PASS** (admin publie assigné → client voit sur sa page Guides).
