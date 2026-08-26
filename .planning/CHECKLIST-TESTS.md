# Checklist de recette — 26/08/2026 matin

> Tout ce qui a été construit hier soir + ce qui était resté à vérifier.
> Cocher au fur et à mesure. Durée estimée : ~45 min.

## 0. Environnement

- [x] Serveur lancé : **http://localhost:3100** (`npm run dev -- -p 3100`)

## 1. Migrations — ✅ FAITES le 26/08 (SQL Editor + sonde verte, 0 faille)

- [ ] Exécuter `supabase/migrations/20260826000001_evaluation_score_mechanics.sql`
      (colonnes score sur evaluations)
- [ ] Exécuter `supabase/migrations/20260826000002_fix_client_select_rls.sql`
      (**corrige la faille de sécurité trouvée cette nuit**)
- [ ] Terminal : `node scripts/verify-security-baseline.mjs`
      → attendu : « 🔒 baseline sécurité : tout est verrouillé » (0 FAILLE)

## 2. Écran Demandes (`/fr/admin/demandes`) — jamais encore vérifié

- [ ] Connexion admin → menu Opérationnel > **Demandes**
- [ ] Autre onglet : `/fr/contact` → envoyer une demande de test
- [ ] Recharger Demandes : la ligne apparaît avec le point orange « Nouvelle »
- [ ] Cliquer la ligne → dialogue : tous les champs, bouton « Répondre » (mailto prérempli)
- [ ] « Marquer traitée » → statut passe à Traitée, point orange disparu
- [ ] Filtres Toutes / Nouvelles / Traitées / Archivées
- [ ] Envoyer aussi une demande d'ÉVALUATION → le détail déplie le bloc « Détails de l'évaluation »
- [ ] Nettoyage base : `delete from contact_requests where email like '%@example.invalid';`

## 3. Notifications

- [ ] Admin → **Notifications** : créer une notif globale (type Information)
- [ ] Navigation privée : connexion CLIENT → cloche visible en haut du rail du portail, pastille « 1 »
- [ ] Ouvrir la cloche → la notif est là ; cliquer dessus → marquée lue, pastille décrémentée
- [ ] « Tout marquer comme lu » fonctionne
- [ ] Admin : créer une notif **ciblée** sur ce client uniquement → visible côté client
- [ ] **Déclencheur document** : admin > Documents → publier un document assigné à ce client → notification auto côté client
- [ ] **Déclencheur certificat** : émettre un certificat pour ce client → notification auto
- [ ] Supprimer les notifications de test depuis l'admin (corbeille)

## 4. Clôture d'évaluation (formulaire d'origine, calcul masqué)

- [ ] Admin → Clients → un client → **Évaluations** → clôturer une évaluation
- [ ] Le formulaire est le formulaire SIMPLE : note A/B/C/D à la main + trois lettres 3C
- [ ] Aucun bloc « Calcul assisté » ne doit apparaître (masqué volontairement, décision du 26/08)
- [ ] Saisir des lettres invalides (ex. « Z9 ») → refusé avec message clair
- [ ] Le rating composite s'affiche bien en bas
- [ ] La clôture enregistre : note visible côté client dans « Ma notation »

## 5. Pages légales

- [ ] `/fr/mentions-legales` et `/fr/politique-de-confidentialite` : 200, marqueurs rouges `[[À FOURNIR]]` visibles
- [ ] `/en/legal-notice` et `/en/privacy-policy` : 200
- [ ] Pied de page de n'importe quelle page : plus aucun lien 404

## 6. Message client (après les tests)

- [ ] Envoyer le brouillon préparé (dans le chat d'hier) avec en pièce jointe
      `docs/informations-legales-a-fournir.md`

## Rappels utiles

- Type check : `cmd /c "npx tsc --noEmit"` · Tests : `npm test` · Build : `npm run build`
- Les 2 migrations sont idempotentes (ré-exécutables sans risque)
