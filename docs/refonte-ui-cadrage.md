# Refonte UI — acte de cadrage (26/08/2026)

> Application de la livraison « Claude Design » (`refonte-visuel/`, hors dépôt).
> Ce document fait foi sur le périmètre et les règles du chantier.

## Décisions actées (grill du 26/08)

1. **Périmètre** : les **12 pages publiques** uniquement, connexion incluse.
   Les espaces admin et portail client ne sont PAS touchés.
2. **Intangibles** : fonctionnalités · textes/contenus validés · structure des
   sections et leur ordre · arborescence · i18n FR/EN · marques CETé ADN® /
   Vigi-Score® · logo.
3. **Identité** : bleu encre `#1A2940` et orange `#E8630A` intangibles ; teintes
   dérivées autorisées selon la fiche tokens.
4. **Git** : commits locaux sur `master`, **ZÉRO push** tant que la refonte
   n'est pas validée (chaque push mettrait à jour l'aperçu Coolify).
5. **Rythme** : application de TOUS les lots d'un bloc, puis **une seule recette**
   finale au navigateur par le porteur du projet. Le client verra la refonte
   seulement quand vous déciderez de la lui présenter.
6. **Arbitrage pixel-perfect** : le porteur du projet seul, en local.
7. **Polices** : Merriweather 900/700 (titres, capitales) + Inter (courant),
   chargées via `next/font` (auto-hébergé, zéro requête externe).
8. **Dark mode vitrine** : n'existe pas (isolé admin/client depuis longtemps) —
   non concerné ; tokens light-only conformes.

## Source de vérité

`Design Tokens.dc.html` prime pour toute valeur (palette, typographie, espacements,
rayons, ombres, composants). Les maquettes `.dc.html` servent de référence visuelle ;
aucun copier-coller brut de leur HTML dans le code Next.js.

## Vérifications obligatoires à chaque lot

- `cmd /c "npx tsc --noEmit"` → exit 0
- `npm run build` → vert (la chaîne prebuild tourne)
- Aucun changement fonctionnel ni textuel vérifié par diff
