# Audit sécurité maison — lot 1 — 26/08/2026 (nuit)

> Remplace l'audit go-live perdu (Phase 5). Outil : `scripts/verify-security-baseline.mjs`,
> sonde différentielle lecture anon vs service-role + écritures anon + exposition
> `NEXT_PUBLIC_`. Exécutable à tout moment : `node scripts/verify-security-baseline.mjs`.

## Constat F1 — contenu « global » du portail lisible sans compte 🔴

- **Quoi** : les politiques `*_client_select` de `client_documents`, `notifications`
  et `resources` autorisaient la lecture de toute ligne `visibility = 'global'` pour
  une requête ANONYME (`visibility = 'global' or current_client_id() = any(...)`,
  et `current_client_id()` vaut NULL en anonyme → branche globale toujours vraie).
- **Preuve** : la sonde a lu 3 documents, 4 notifications et des ressources avec la
  clé anon seule, sans session.
- **Impact** : fuite de contenus destinés aux clients connectés. Aucune donnée
  personnelle exposée (les tables sensibles clients/évaluations/profiles sont
  correctement verrouillées — vérifié).
- **Correctif** : migration `20260826000002_fix_client_select_rls.sql` (idempotente,
  exige `auth.uid() is not null`). À appliquer manuellement au SQL Editor.

## Constats vérifiés SANS faille ✅

| Contrôle | Résultat |
|---|---|
| Lecture anon `clients`, `evaluations`, `profiles`, `contract_documents` | 0 ligne visible (RLS filtre) |
| Écriture anon `notifications`, `notification_reads`, `contact_requests` | refusée (42501) |
| Variables sensibles préfixées `NEXT_PUBLIC_` | aucune |

## Reste à couvrir (lots suivants)

- Politiques des buckets storage (lecture directe d'objets)
- Vérification des triggers anti-escalade de privilèges
- CSP complète au-delà de `frame-ancestors`, cookies de session (Secure/SameSite)
- Anti-rafale du formulaire : test comportemental (5 demandes / 10 min / IP)

## Action requise demain

1. Appliquer `20260826000002_fix_client_select_rls.sql` dans le SQL Editor.
2. Relancer la sonde → attendu « 0 FAILLE ».
