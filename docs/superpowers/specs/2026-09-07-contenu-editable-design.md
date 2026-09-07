# Contenu du site entièrement éditable — design (2026-09-07)

> Étend à tout le site public le pattern déjà validé sur `founders`/`settings` :
> contenu en base, admin qui l'édite, vitrine qui lit la base avec repli JSON/
> traductions si la base est vide ou injoignable. **La vitrine ne casse jamais.**

## Objectif

Rendre éditable depuis le back-office admin, sans toucher au code, l'intégralité
du contenu des 12 pages publiques : texte libre, images, et les 5 listes
actuellement figées en JSON (services, piliers, valeurs, navigation,
organisations).

## Hors périmètre (explicitement)

- Édition visuelle sur la page (WYSIWYG) — formulaires structurés uniquement.
- Réorganisation/ajout de blocs — la structure des sections reste celle actée
  lors de la refonte UI d'août (`docs/refonte-ui-cadrage.md`).
- Rôle "éditeur" restreint — admin uniquement, comme le reste du back-office.
- Admin/portail client — non concernés (déjà exclus du périmètre refonte).

## Inventaire des 12 pages publiques

`home` (`(public)/page.tsx`), `a-propos`, `services`, `expertise`, `contact`,
`blog` (index — les articles restent gérés par `articles.repo.ts`, pas par ce
système), `glossaire`, `observatoire`, `verifier`, `cgu`, `legal`, `privacy`,
`connexion`. Le champ exact édité par page (quels titres/paragraphes/images)
est déclaré page par page pendant la construction, pas figé ici — certaines
pages n'ont que 2-3 champs pertinents (ex. `verifier`), d'autres davantage
(ex. `home`).

## Brique 1 — Listes structurées (services, piliers, valeurs, navigation, organisations)

Réplique exacte du pattern `founders` :

- 1 table Supabase par collection, colonnes traduites en `jsonb {fr,en}`,
  `visible boolean`, `created_at`. Une migration idempotente par table
  (`supabase/migrations/`, voir son README avant d'écrire — application manuelle
  au SQL Editor).
- RLS : lecture publique sur les lignes `visible = true`, écriture réservée aux
  admins (même politique que `founders_public_select` / les policies admin
  existantes).
- 1 repo par collection (`src/lib/repo/services.repo.ts`, etc.), même forme que
  `founders.repo.ts` : `listAll`, `update`, merge FR/EN préservant la valeur EN
  existante à l'écriture (comme `mergeStr`/`mergeArr`).
- `src/lib/vitrine-data.ts` (ou un fichier dédié si la 250-lignes déborde) :
  une fonction `loadX(locale)` par collection — essaie la DB, retombe sur
  `data-loader.ts` (donc sur le JSON) si la DB est vide ou en erreur, exactement
  comme `loadFounders`.
- 1 page admin CRUD par collection sous `/admin/settings/<collection>` (ou
  regroupées dans une page à onglets si plus léger — décidé à la construction),
  suivant le patron déjà utilisé par la page fondateurs.
- `navigation` est un cas particulier (une structure imbriquée, pas une liste
  plate) : elle peut rester en JSON si sa mise en base s'avère disproportionnée
  vu son usage (rendu au build, jamais modifié en pratique) — à trancher au
  moment de l'implémenter ; si le gain d'éditabilité est marginal face au risque
  de casser le menu, elle reste hors-brique-1 et c'est documenté dans le rapport
  final, pas une réouverture de scope.

## Brique 2 — Texte libre et images des 12 pages

### Modèle de données

Une seule table de surcharges, pas une table par page :

```sql
create table page_content_overrides (
  page_key   text not null,
  field_key  text not null,
  value      jsonb not null,        -- { "fr": "...", "en": "...", "type": "text" | "image" }
  updated_at timestamptz not null default now(),
  primary key (page_key, field_key)
);
```

RLS : lecture publique (select), écriture admin uniquement (même policy pattern
que `settings`). **Aucune ligne n'existe tant que l'admin n'a rien personnalisé**
— une page jamais éditée continue d'afficher exactement son texte actuel
(`messages/{fr,en}.json` via next-intl), donc le déploiement initial de cette
fonctionnalité ne change RIEN de visible sur le site.

### Schéma déclaratif par page

`src/lib/page-content/<page-key>.ts` (un fichier par page — respecte la limite
de 250 lignes et évite un seul fichier monstre pour 12 pages) exportant un
tableau typé :

```ts
export const homeFields: PageContentField[] = [
  { key: "hero.title", label: "Titre du hero", type: "text" },
  { key: "hero.image", label: "Image du hero", type: "image" },
  // ...
];
```

`src/lib/page-content/index.ts` (≤ 20 lignes) agrège les 12 fichiers dans un
`Record<PageKey, PageContentField[]>`.

### Lecture côté vitrine

`src/lib/repo/page-content.repo.ts` expose `getPageOverrides(pageKey)` (une
requête, toutes les surcharges de la page). Un petit helper
`src/lib/page-content/resolve.ts` :

```ts
function resolveText(overrides, fieldKey, fallbackT: string): string
function resolveImage(overrides, fieldKey, fallbackSrc: string): string
```

Chaque page publique migrée appelle `getPageOverrides("home")` une fois (server
component), puis remplace `t("hero.title")` par
`resolveText(overrides, "hero.title", t("hero.title"))`. Le fallback est
toujours la traduction next-intl existante : zéro risque de régression sur les
pages pas encore migrées, et zéro required-seed sur les pages migrées.

### Édition côté admin

Une page admin générique `/admin/settings/pages` : sélecteur de page → formulaire
généré depuis `page-content/<page-key>.ts` (champs texte FR/EN côte à côte,
champs image = upload + aperçu). Un champ vidé = suppression de la ligne
(retour au texte par défaut), pas une valeur vide en base.

### Images

Nouveau bucket Supabase Storage public `site-images` (même pattern que
`blog-images` : upload → `getPublicUrl`, pas d'URL signée puisque public par
nature). Chemin : `<page-key>/<uuid>-<nom-sûr>`.

## Vérification à chaque tranche

- `npx tsc --noEmit` → 0
- `npm run build` → vert (76+ routes, `lint:lines` inclus)
- Aucune régression visuelle sur les pages non encore migrées (elles continuent
  de lire next-intl directement tant qu'elles n'appellent pas `resolveText`)
- Contrôle navigateur : la page affiche le texte par défaut sans rien en base,
  puis reflète une édition admin après sauvegarde, en FR et en EN

## Ordre de construction

1. Mécanisme générique (table, repo, helper de résolution, page admin) validé
   sur **une seule page pilote** (`home`) de bout en bout, texte + image.
2. Déclinaison du schéma aux 11 pages restantes par lots de 3-4, `tsc`/`build`
   après chaque lot.
3. Migration des listes structurées (brique 1), une collection à la fois.
4. Régression finale complète (build + parcours navigateur FR/EN des 12 pages
   + un aller-retour d'édition admin par type de contenu).

## Git

Commits locaux, séparés par changement logique (une migration = un commit, un
lot de pages = un commit), suivant la convention du dépôt. **Zéro push** avant
validation explicite — même règle que la refonte UI d'août
(`docs/refonte-ui-cadrage.md`), pour ne pas déclencher le déploiement Coolify
pendant que le travail est en cours.
