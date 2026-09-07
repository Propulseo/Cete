# Contenu de site éditable — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre éditable depuis `/admin` tout le texte, les images et les listes
structurées des pages publiques de CETé, sans jamais casser la vitrine si la
base est vide ou injoignable.

**Architecture:** Deux mécanismes, tous deux répliquant le pattern déjà en place
sur `founders`/`settings`/`organizations` (table Supabase + repli JSON/i18n) :
(1) trois nouvelles tables `values`, `pillars`, `services` pour les listes
figées restantes ; (2) une table générique `page_content_overrides` +
schéma déclaratif par page qui laisse chaque page continuer à afficher son
texte `next-intl` par défaut tant que rien n'a été personnalisé.

**Tech Stack:** Next.js 15 (App Router, composants serveur), Supabase (Postgres
+ Storage), next-intl, Vitest.

**Spec:** [docs/superpowers/specs/2026-09-07-contenu-editable-design.md](../specs/2026-09-07-contenu-editable-design.md)

## Global Constraints

- TypeScript strict, jamais de `any` (types dans `src/types/`, barrel `index.ts`).
- Alias `@/` uniquement, jamais d'import relatif `../../`.
- `src/app/**/page.tsx` et `src/components/sections/**/*.tsx` : 250 lignes max
  (`npm run lint:lines`, bloquant au build). Les repos/libs n'ont pas ce plafond
  dur mais restent découpés par responsabilité.
- Après chaque tâche : `npx tsc --noEmit` (0 erreur) puis `npm run build` (vert).
- Migrations Supabase : écrites idempotentes (`create table if not exists`,
  `do $$ if not exists ... end $$` pour les policies), appliquées **à la main**
  au SQL Editor du dashboard — jamais `supabase db push` (voir
  `supabase/migrations/README.md`). Numérotées après `20260827000001`.
- Git : un commit local par tâche, jamais de push (voir §Git du design).
- next-intl : l'admin édite le FR ; à l'écriture, la valeur EN existante est
  préservée si elle existe, sinon elle est mirroir du FR — même convention que
  `founders.repo.ts` (`mergeStr`).
- Exclusions actées pendant la reconnaissance du code (détail par tâche
  ci-dessous, ne pas rouvrir sans validation) : `legal`, `cgu`, `privacy`
  (texte légal dense, marqueurs `[[À FOURNIR]]`, hors périmètre) ; `verifier`
  (aucun `next-intl` câblé — le rendre éditable exigerait d'abord de
  l'internationaliser, hors périmètre de cette fonctionnalité) ; `navigation`
  reste en JSON (menu = risque élevé, gain marginal, jamais modifié en
  pratique) ; les appels `t.rich(...)` / `t.raw(...)` restent hors périmètre
  (texte à mise en forme intégrée, non représentable par une simple chaîne) ;
  les libellés fonctionnels (validation de formulaire, aria, toasts d'état,
  placeholders liés au comportement) restent hors périmètre — seul le texte
  éditorial (titres, badges, descriptions, CTA) est concerné.

---

## PHASE A — Fondations du mécanisme générique

### Task 1: Migration — table `page_content_overrides`

**Files:**
- Create: `supabase/migrations/20260907000001_page_content_overrides.sql`

**Interfaces:**
- Produces: table `public.page_content_overrides(page_key text, field_key text, value jsonb, updated_at timestamptz)`, clé primaire `(page_key, field_key)`, RLS `page_content_overrides_admin_all` / `page_content_overrides_public_select`.

- [ ] **Step 1: Écrire la migration**

```sql
-- ============================================================================
-- CETé — page_content_overrides : surcharges de contenu éditées par l'admin.
-- Aucune ligne tant qu'un champ n'a pas été personnalisé : la vitrine continue
-- d'afficher next-intl par défaut (voir resolveText/resolveImage).
-- ============================================================================

create table if not exists public.page_content_overrides (
  page_key   text not null,
  field_key  text not null,
  value      jsonb not null,        -- { "fr": "...", "en": "..." }
  updated_at timestamptz not null default now(),
  primary key (page_key, field_key)
);
alter table public.page_content_overrides enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'page_content_overrides'
      and policyname = 'page_content_overrides_admin_all'
  ) then
    create policy "page_content_overrides_admin_all" on public.page_content_overrides
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'page_content_overrides'
      and policyname = 'page_content_overrides_public_select'
  ) then
    create policy "page_content_overrides_public_select" on public.page_content_overrides
      for select using (true);
  end if;
end $$;
```

- [ ] **Step 2: Appliquer au SQL Editor Supabase (dashboard), coller puis Run**

- [ ] **Step 3: Vérifier l'application**

Run une requête de contrôle dans le SQL Editor :
```sql
select count(*) from public.page_content_overrides;
```
Expected: `0` sans erreur (table créée, RLS active).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260907000001_page_content_overrides.sql
git commit -m "feat(db): table page_content_overrides pour le contenu editable"
```

---

### Task 2: Migration — bucket Storage `site-images`

**Files:**
- Create: `supabase/migrations/20260907000002_site_images_bucket.sql`

**Interfaces:**
- Produces: bucket public `site-images`, policies `site_images_public_read` / `site_images_admin_all` sur `storage.objects`.

- [ ] **Step 1: Écrire la migration (mirroir exact de `blog-images`, voir `20260530000003_articles_editorial_fields.sql`)**

```sql
-- ============================================================================
-- CETé — bucket public site-images (images des pages publiques hors blog)
-- ============================================================================

insert into storage.buckets (id, name, public) values
  ('site-images', 'site-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'site_images_public_read'
  ) then
    create policy "site_images_public_read" on storage.objects
      for select
      using (bucket_id = 'site-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'site_images_admin_all'
  ) then
    create policy "site_images_admin_all" on storage.objects
      for all
      using (bucket_id = 'site-images' and public.is_admin())
      with check (bucket_id = 'site-images' and public.is_admin());
  end if;
end $$;
```

- [ ] **Step 2: Appliquer au SQL Editor Supabase**

- [ ] **Step 3: Vérifier** — dashboard Supabase → Storage → le bucket `site-images` apparaît, marqué "Public".

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260907000002_site_images_bucket.sql
git commit -m "feat(storage): bucket public site-images pour les images de page"
```

---

### Task 3: Types partagés

**Files:**
- Create: `src/types/page-content.ts`
- Modify: `src/types/index.ts` (ajouter l'export barrel)

**Interfaces:**
- Produces: `PageContentField`, `PageContentFieldType`, `PageOverrideValue`, `PageOverridesMap`.

- [ ] **Step 1: Écrire les types**

```ts
export type PageContentFieldType = "text" | "textarea" | "image";

export interface PageContentField {
  /** Identifiant stable, unique dans la page (ex: "hero.badge"). */
  key: string;
  /** Libellé affiché dans le formulaire admin. */
  label: string;
  type: PageContentFieldType;
}

export interface PageOverrideValue {
  fr: string;
  en: string;
}

/** field_key -> valeur, pour une page donnée. */
export type PageOverridesMap = Record<string, PageOverrideValue>;
```

- [ ] **Step 2: Ajouter au barrel**

Dans `src/types/index.ts`, ajouter :
```ts
export * from "./page-content";
```

- [ ] **Step 3: Vérifier**

Run: `npx tsc --noEmit`
Expected: 0 erreur.

- [ ] **Step 4: Commit**

```bash
git add src/types/page-content.ts src/types/index.ts
git commit -m "feat(types): types du contenu de page editable"
```

---

### Task 4: Repo admin — `page-content.repo.ts`

**Files:**
- Create: `src/lib/repo/page-content.repo.ts`

**Interfaces:**
- Consumes: `RepoError` (`@/types/repo-error`), `createClient` (`@/lib/supabase/client`), `PageOverridesMap`/`PageOverrideValue` (`@/types`).
- Produces: `getPageOverrides(pageKey: string): Promise<PageOverridesMap>`, `setPageOverrideText(pageKey: string, fieldKey: string, fr: string): Promise<void>`, `clearPageOverride(pageKey: string, fieldKey: string): Promise<void>`, `uploadPageImage(pageKey: string, file: File): Promise<string>`.

- [ ] **Step 1: Écrire le repo**

```ts
import { createClient } from "@/lib/supabase/client";
import { RepoError } from "@/types/repo-error";
import type { PageOverridesMap } from "@/types";

const BUCKET = "site-images";

export async function getPageOverrides(pageKey: string): Promise<PageOverridesMap> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("page_content_overrides")
    .select("field_key, value")
    .eq("page_key", pageKey);
  if (error) throw new RepoError("Impossible de charger le contenu de la page", "page_content_overrides", "list");
  const result: PageOverridesMap = {};
  for (const row of data ?? []) {
    const v = row.value as { fr?: string; en?: string };
    result[row.field_key] = { fr: v.fr ?? "", en: v.en ?? v.fr ?? "" };
  }
  return result;
}

export async function setPageOverrideText(pageKey: string, fieldKey: string, fr: string): Promise<void> {
  const supabase = createClient();
  const { data: cur } = await supabase
    .from("page_content_overrides")
    .select("value")
    .eq("page_key", pageKey)
    .eq("field_key", fieldKey)
    .maybeSingle();
  const en = (cur?.value as { en?: string } | null)?.en ?? fr;
  const { error } = await supabase
    .from("page_content_overrides")
    .upsert({ page_key: pageKey, field_key: fieldKey, value: { fr, en } });
  if (error) throw new RepoError("Impossible d'enregistrer ce champ", "page_content_overrides", "update");
}

export async function clearPageOverride(pageKey: string, fieldKey: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("page_content_overrides")
    .delete()
    .eq("page_key", pageKey)
    .eq("field_key", fieldKey);
  if (error) throw new RepoError("Impossible de reinitialiser ce champ", "page_content_overrides", "delete");
}

function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${base || "image"}${ext}`;
}

export async function uploadPageImage(pageKey: string, file: File): Promise<string> {
  const supabase = createClient();
  const path = `${pageKey}/${crypto.randomUUID()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new RepoError("Impossible de televerser l'image", "site-images", "upload");
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
```

Note : `setPageOverrideText` sert aussi pour les images — l'appelant passe l'URL
publique (retour de `uploadPageImage`) comme `fr`. Un seul champ `fr`/`en` par
ligne suffit : les images ne sont pas traduites (même URL pour les deux
locales), donc `en` recopie simplement l'URL.

- [ ] **Step 2: Vérifier**

Run: `npx tsc --noEmit`
Expected: 0 erreur.

- [ ] **Step 3: Commit**

```bash
git add src/lib/repo/page-content.repo.ts
git commit -m "feat(repo): CRUD des surcharges de contenu de page"
```

---

### Task 5: Résolution + repli — `resolve.ts` (testé, sans Supabase)

**Files:**
- Create: `src/lib/page-content/resolve.ts`
- Test: `src/lib/page-content/resolve.test.ts`

**Interfaces:**
- Consumes: `PageOverridesMap` (`@/types`).
- Produces: `resolveText(overrides: PageOverridesMap, fieldKey: string, fallback: string, locale?: "fr" | "en"): string`, `resolveImage(overrides: PageOverridesMap, fieldKey: string, fallbackSrc: string): string`.

- [ ] **Step 1: Écrire le test qui échoue**

```ts
import { describe, expect, it } from "vitest";
import { resolveText, resolveImage } from "./resolve";

describe("resolveText", () => {
  it("retombe sur le fallback si aucune surcharge", () => {
    expect(resolveText({}, "hero.badge", "Texte par defaut")).toBe("Texte par defaut");
  });

  it("utilise la surcharge FR si presente", () => {
    const overrides = { "hero.badge": { fr: "Texte admin", en: "Admin text" } };
    expect(resolveText(overrides, "hero.badge", "Texte par defaut", "fr")).toBe("Texte admin");
  });

  it("utilise la surcharge EN quand locale=en", () => {
    const overrides = { "hero.badge": { fr: "Texte admin", en: "Admin text" } };
    expect(resolveText(overrides, "hero.badge", "Default", "en")).toBe("Admin text");
  });

  it("ignore une surcharge vide (chaine vide = pas de personnalisation)", () => {
    const overrides = { "hero.badge": { fr: "", en: "" } };
    expect(resolveText(overrides, "hero.badge", "Texte par defaut")).toBe("Texte par defaut");
  });
});

describe("resolveImage", () => {
  it("retombe sur le fallback si aucune surcharge", () => {
    expect(resolveImage({}, "rse.logo", "/images/partners/esf-logo.png")).toBe(
      "/images/partners/esf-logo.png",
    );
  });

  it("utilise l'URL personnalisee si presente", () => {
    const overrides = { "rse.logo": { fr: "https://x.supabase.co/site-images/a.png", en: "" } };
    expect(resolveImage(overrides, "rse.logo", "/images/partners/esf-logo.png")).toBe(
      "https://x.supabase.co/site-images/a.png",
    );
  });
});
```

- [ ] **Step 2: Lancer le test, verifier qu'il echoue**

Run: `npx vitest run src/lib/page-content/resolve.test.ts`
Expected: FAIL — `resolve.ts` n'existe pas encore.

- [ ] **Step 3: Implementer**

```ts
import type { PageOverridesMap } from "@/types";

export function resolveText(
  overrides: PageOverridesMap,
  fieldKey: string,
  fallback: string,
  locale: "fr" | "en" = "fr",
): string {
  const value = overrides[fieldKey]?.[locale];
  return value && value.trim() !== "" ? value : fallback;
}

export function resolveImage(
  overrides: PageOverridesMap,
  fieldKey: string,
  fallbackSrc: string,
): string {
  const value = overrides[fieldKey]?.fr;
  return value && value.trim() !== "" ? value : fallbackSrc;
}
```

- [ ] **Step 4: Lancer le test, verifier qu'il passe**

Run: `npx vitest run src/lib/page-content/resolve.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/page-content/resolve.ts src/lib/page-content/resolve.test.ts
git commit -m "feat(page-content): resolveText/resolveImage avec repli sur le defaut"
```

---

### Task 6: Chargeur serveur — `loadPageOverrides`

**Files:**
- Create: `src/lib/page-content/server.ts`

**Interfaces:**
- Consumes: `createClient` (`@/lib/supabase/server`), `PageOverridesMap` (`@/types`).
- Produces: `loadPageOverrides(pageKey: string): Promise<PageOverridesMap>` — server-only (importe `@/lib/supabase/server`, comme `vitrine-data.ts`).

- [ ] **Step 1: Ecrire le chargeur (repli garanti : la vitrine ne casse jamais)**

```ts
import { createClient } from "@/lib/supabase/server";
import type { PageOverridesMap } from "@/types";

export async function loadPageOverrides(pageKey: string): Promise<PageOverridesMap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_content_overrides")
      .select("field_key, value")
      .eq("page_key", pageKey);
    if (error || !data) return {};
    const result: PageOverridesMap = {};
    for (const row of data) {
      const v = row.value as { fr?: string; en?: string };
      result[row.field_key] = { fr: v.fr ?? "", en: v.en ?? v.fr ?? "" };
    }
    return result;
  } catch {
    return {};
  }
}
```

- [ ] **Step 2: Verifier**

Run: `npx tsc --noEmit`
Expected: 0 erreur.

- [ ] **Step 3: Commit**

```bash
git add src/lib/page-content/server.ts
git commit -m "feat(page-content): chargeur serveur avec repli silencieux"
```

---

### Task 7: Schéma déclaratif — agrégateur + page pilote `home`

**Files:**
- Create: `src/lib/page-content/pages/home.ts`
- Create: `src/lib/page-content/pages/about.ts`
- Create: `src/lib/page-content/index.ts`

**Interfaces:**
- Consumes: `PageContentField` (`@/types`).
- Produces: `PAGE_KEYS: readonly string[]`, `PAGE_CONTENT_SCHEMA: Record<string, PageContentField[]>`, `getPageSchema(pageKey: string): PageContentField[]`.

- [ ] **Step 1: Champs de la page pilote `home` (issus de `src/components/sections/home/HomeHero.tsx`)**

```ts
import type { PageContentField } from "@/types";

export const homeFields: PageContentField[] = [
  { key: "hero.badge", label: "Hero - badge", type: "text" },
  { key: "hero.titleLine1", label: "Hero - titre ligne 1", type: "text" },
  { key: "hero.titleLine2", label: "Hero - titre ligne 2", type: "text" },
  { key: "hero.titleLine3", label: "Hero - titre ligne 3", type: "text" },
  { key: "hero.titleLine4", label: "Hero - titre ligne 4", type: "text" },
  { key: "hero.baseline", label: "Hero - accroche", type: "text" },
  { key: "hero.slogan", label: "Hero - slogan", type: "text" },
  { key: "hero.subtitle", label: "Hero - sous-titre", type: "textarea" },
  { key: "hero.discoverRating", label: "Hero - bouton decouvrir la notation", type: "text" },
  { key: "hero.requestEvaluation", label: "Hero - bouton demander une evaluation", type: "text" },
  { key: "hero.trustIndicator", label: "Hero - texte de confiance", type: "text" },
  { key: "adn.badge", label: "ADN - badge", type: "text" },
  { key: "adn.heading", label: "ADN - titre", type: "text" },
  { key: "adn.description", label: "ADN - description", type: "textarea" },
  { key: "adn.assemblyLabel", label: "ADN - libelle assemblage", type: "text" },
  { key: "adn.understandRating", label: "ADN - bouton comprendre la notation", type: "text" },
  { key: "pillars.badge", label: "Piliers - badge", type: "text" },
  { key: "pillars.heading", label: "Piliers - titre", type: "text" },
  { key: "pillars.description", label: "Piliers - description", type: "textarea" },
  { key: "services.badge", label: "Services - badge", type: "text" },
  { key: "services.heading", label: "Services - titre", type: "text" },
  { key: "services.description", label: "Services - description", type: "textarea" },
  { key: "services.viewAll", label: "Services - bouton voir tout", type: "text" },
  { key: "organizations.badge", label: "Organisations - badge", type: "text" },
  { key: "organizations.heading", label: "Organisations - titre", type: "text" },
  { key: "organizations.description", label: "Organisations - description", type: "textarea" },
  { key: "testimonials.badge", label: "Temoignages - badge", type: "text" },
  { key: "testimonials.heading", label: "Temoignages - titre", type: "text" },
  { key: "testimonials.pullQuote", label: "Temoignage - citation", type: "textarea" },
  { key: "testimonials.paragraph1", label: "Temoignage - paragraphe 1", type: "textarea" },
  { key: "testimonials.paragraph2", label: "Temoignage - paragraphe 2", type: "textarea" },
  { key: "testimonials.paragraph3", label: "Temoignage - paragraphe 3", type: "textarea" },
  { key: "testimonials.paragraph4", label: "Temoignage - paragraphe 4", type: "textarea" },
  { key: "testimonials.authorName", label: "Temoignage - nom de l'auteur", type: "text" },
  { key: "testimonials.authorRole", label: "Temoignage - role de l'auteur", type: "text" },
  { key: "testimonials.authorCompany", label: "Temoignage - entreprise de l'auteur", type: "text" },
  { key: "cta.heading", label: "CTA final - titre", type: "text" },
  { key: "cta.description", label: "CTA final - description", type: "textarea" },
  { key: "cta.requestEvaluation", label: "CTA final - bouton demander une evaluation", type: "text" },
  { key: "cta.clientArea", label: "CTA final - bouton espace client", type: "text" },
];
```

- [ ] **Step 2: Champs de la page `about` (source : `AboutHero`, `AboutOriginStory`,
`AboutGouvernance`, `AboutRSE`, `AboutValues`, `AboutWorldMap`, `AboutCTA` —
`AboutStats`/`AboutFounders` exclus : chiffres calcules / fondateurs deja en DB ;
`t.rich("heading")`/`t.rich("subtitle")` de `AboutHero` et `t.rich("heading")` de
`AboutRSE` exclus, voir Global Constraints)**

```ts
import type { PageContentField } from "@/types";

export const aboutFields: PageContentField[] = [
  { key: "hero.badge", label: "Hero - badge", type: "text" },
  { key: "hero.description", label: "Hero - description", type: "textarea" },
  { key: "originStory.badge", label: "Histoire - badge", type: "text" },
  { key: "originStory.motto", label: "Histoire - devise", type: "text" },
  { key: "governance.badge", label: "Gouvernance - badge", type: "text" },
  { key: "governance.description", label: "Gouvernance - description", type: "textarea" },
  { key: "rse.badge", label: "RSE - badge", type: "text" },
  { key: "rse.subtitle", label: "RSE - sous-titre", type: "textarea" },
  { key: "rse.logo", label: "RSE - logo partenaire", type: "image" },
  { key: "rse.partnerTitle", label: "RSE - titre du partenaire", type: "text" },
  { key: "rse.paragraph1", label: "RSE - paragraphe 1", type: "textarea" },
  { key: "rse.paragraph2", label: "RSE - paragraphe 2", type: "textarea" },
  { key: "values.badge", label: "Valeurs - badge", type: "text" },
  { key: "values.heading", label: "Valeurs - titre", type: "text" },
  { key: "values.description", label: "Valeurs - description", type: "textarea" },
  { key: "worldMap.badge", label: "Carte - badge", type: "text" },
  { key: "worldMap.heading", label: "Carte - titre", type: "text" },
  { key: "worldMap.description", label: "Carte - description", type: "textarea" },
  { key: "cta.badge", label: "CTA - badge", type: "text" },
  { key: "cta.description", label: "CTA - description", type: "textarea" },
  { key: "cta.primaryButton", label: "CTA - bouton principal", type: "text" },
  { key: "cta.secondaryButton", label: "CTA - bouton secondaire", type: "text" },
];
```

- [ ] **Step 3: Agregateur**

```ts
import type { PageContentField } from "@/types";
import { homeFields } from "./pages/home";
import { aboutFields } from "./pages/about";

export const PAGE_CONTENT_SCHEMA: Record<string, PageContentField[]> = {
  home: homeFields,
  "a-propos": aboutFields,
};

export const PAGE_LABELS: Record<string, string> = {
  home: "Accueil",
  "a-propos": "A propos",
};

export const PAGE_KEYS = Object.keys(PAGE_CONTENT_SCHEMA);

export function getPageSchema(pageKey: string): PageContentField[] {
  return PAGE_CONTENT_SCHEMA[pageKey] ?? [];
}
```

- [ ] **Step 4: Verifier**

Run: `npx tsc --noEmit`
Expected: 0 erreur.

- [ ] **Step 5: Commit**

```bash
git add src/lib/page-content/pages/home.ts src/lib/page-content/pages/about.ts src/lib/page-content/index.ts
git commit -m "feat(page-content): schema declaratif home + about"
```

---

### Task 8: Formulaire admin générique

**Files:**
- Create: `src/components/features/admin/page-content/PageContentForm.tsx`
- Create: `src/app/[locale]/admin/settings/pages/page.tsx`
- Modify: `src/components/features/admin/AdminSidebar.tsx:53-59` (groupe "Contenu du site")

**Interfaces:**
- Consumes: `getPageOverrides`/`setPageOverrideText`/`clearPageOverride`/`uploadPageImage` (`@/lib/repo/page-content.repo`), `PAGE_KEYS`/`PAGE_LABELS`/`getPageSchema` (`@/lib/page-content`), `CoverImageField` (`@/components/features/admin/blog/CoverImageField`).
- Produces: route `/admin/settings/pages`, entree de navigation "Contenu des pages".

- [ ] **Step 1: Formulaire (un champ = un input/textarea/CoverImageField + bouton reinitialiser)**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoverImageField } from "@/components/features/admin/blog/CoverImageField";
import {
  getPageOverrides,
  setPageOverrideText,
  clearPageOverride,
  uploadPageImage,
} from "@/lib/repo/page-content.repo";
import { getPageSchema } from "@/lib/page-content";
import type { PageOverridesMap } from "@/types";

export function PageContentForm({ pageKey }: { pageKey: string }) {
  const fields = getPageSchema(pageKey);
  const [overrides, setOverrides] = useState<PageOverridesMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    setLoading(true);
    getPageOverrides(pageKey).then((data) => {
      setOverrides(data);
      setLoading(false);
    });
  }, [pageKey]);

  const handleSaveText = async (fieldKey: string, value: string) => {
    setSaving(fieldKey);
    try {
      await setPageOverrideText(pageKey, fieldKey, value);
      setOverrides((prev) => ({ ...prev, [fieldKey]: { fr: value, en: prev[fieldKey]?.en ?? value } }));
      toast.success("Enregistre");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveImage = async (fieldKey: string) => {
    const file = pendingFiles[fieldKey];
    if (!file) return;
    setSaving(fieldKey);
    try {
      const url = await uploadPageImage(pageKey, file);
      await setPageOverrideText(pageKey, fieldKey, url);
      setOverrides((prev) => ({ ...prev, [fieldKey]: { fr: url, en: url } }));
      setPendingFiles((prev) => ({ ...prev, [fieldKey]: null }));
      toast.success("Image mise a jour");
    } catch {
      toast.error("Erreur lors du televersement");
    } finally {
      setSaving(null);
    }
  };

  const handleReset = async (fieldKey: string) => {
    setSaving(fieldKey);
    try {
      await clearPageOverride(pageKey, fieldKey);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
      toast.success("Revenu au texte par defaut");
    } catch {
      toast.error("Erreur lors de la reinitialisation");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const current = overrides[field.key]?.fr ?? "";
        const isCustomized = current.trim() !== "";
        return (
          <div key={field.key} className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <Label>{field.label}</Label>
              {isCustomized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReset(field.key)}
                  disabled={saving === field.key}
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" strokeWidth={1.75} />
                  Revenir au texte par defaut
                </Button>
              )}
            </div>

            {field.type === "image" ? (
              <div className="space-y-2">
                <CoverImageField
                  file={pendingFiles[field.key] ?? null}
                  onFileChange={(file) => setPendingFiles((prev) => ({ ...prev, [field.key]: file }))}
                  currentUrl={current || null}
                  onClearCurrent={() => handleReset(field.key)}
                />
                {pendingFiles[field.key] && (
                  <Button size="sm" onClick={() => handleSaveImage(field.key)} disabled={saving === field.key}>
                    <Save className="mr-2 h-4 w-4" strokeWidth={1.75} />
                    Televerser et enregistrer
                  </Button>
                )}
              </div>
            ) : field.type === "textarea" ? (
              <FieldTextarea value={current} onSave={(v) => handleSaveText(field.key, v)} saving={saving === field.key} />
            ) : (
              <FieldInput value={current} onSave={(v) => handleSaveText(field.key, v)} saving={saving === field.key} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldInput({ value, onSave, saving }: { value: string; onSave: (v: string) => void; saving: boolean }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="flex gap-2">
      <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Texte par defaut si vide" />
      <Button size="sm" onClick={() => onSave(draft)} disabled={saving || draft === value}>
        <Save className="h-4 w-4" strokeWidth={1.75} />
      </Button>
    </div>
  );
}

function FieldTextarea({ value, onSave, saving }: { value: string; onSave: (v: string) => void; saving: boolean }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="space-y-2">
      <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Texte par defaut si vide" />
      <Button size="sm" onClick={() => onSave(draft)} disabled={saving || draft === value}>
        <Save className="mr-2 h-4 w-4" strokeWidth={1.75} />
        Enregistrer
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Page admin avec selecteur de page**

```tsx
"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/features/admin/ui/admin-page-header";
import { PageContentForm } from "@/components/features/admin/page-content/PageContentForm";
import { PAGE_KEYS, PAGE_LABELS } from "@/lib/page-content";
import { cn } from "@/lib/utils";

export default function AdminPagesContentPage() {
  const [pageKey, setPageKey] = useState(PAGE_KEYS[0]);

  return (
    <div className="p-4 lg:p-8">
      <AdminPageHeader
        title="Contenu des pages"
        subtitle="Modifiez le texte et les images du site public. Un champ vide affiche le texte par defaut."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {PAGE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setPageKey(key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              key === pageKey
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {PAGE_LABELS[key]}
          </button>
        ))}
      </div>

      <PageContentForm pageKey={pageKey} />
    </div>
  );
}
```

- [ ] **Step 3: Ajouter l'entree de navigation**

Dans `src/components/features/admin/AdminSidebar.tsx`, groupe `"Contenu du site"`
(lignes 53-59), ajouter apres `Organisations` :
```ts
{ label: "Contenu des pages", href: "/admin/settings/pages", icon: FileText },
```
(`FileText` deja importe depuis `lucide-react` en tete de fichier.)

- [ ] **Step 4: Verifier**

Run: `npx tsc --noEmit` puis `npm run build`
Expected: 0 erreur, build vert.
Controle navigateur : `npm run dev`, se connecter en admin, ouvrir
`/fr/admin/settings/pages`, verifier que le formulaire affiche les 39 champs
de `home` et bascule vers `a-propos`.

- [ ] **Step 5: Commit**

```bash
git add src/components/features/admin/page-content/PageContentForm.tsx src/app/'[locale]'/admin/settings/pages/page.tsx src/components/features/admin/AdminSidebar.tsx
git commit -m "feat(admin): formulaire generique d'edition du contenu de page"
```

---

## PHASE B — Preuve de bout en bout (pilote)

### Task 9: Câbler `HomeHero.tsx`

**Files:**
- Modify: `src/components/sections/home/HomeHero.tsx`

**Interfaces:**
- Consumes: `resolveText` (`@/lib/page-content/resolve`), `loadPageOverrides` (`@/lib/page-content/server`).

`HomeHero` est actuellement un composant client (`"use client"`) sans acces
direct aux overrides serveur. Comme `HomeFounders` (qui recoit `founders` en
prop depuis `page.tsx`), on fait remonter le chargement au composant serveur
parent et on passe les overrides en prop.

- [ ] **Step 1: Modifier `src/app/[locale]/(public)/page.tsx`**

```tsx
// Ajout de l'import
import { loadPageOverrides } from "@/lib/page-content/server";

// Dans HomePage, à côté du Promise.all existant :
const [founders, organizations, overrides] = await Promise.all([
  loadFounders(locale as "fr" | "en"),
  loadOrganizations(),
  loadPageOverrides("home"),
]);

// Passer overrides à HomeHero :
<HomeHero overrides={overrides} locale={locale as "fr" | "en"} />
```

- [ ] **Step 2: Modifier `HomeHero.tsx` — accepter les props et remplacer les `t()` textuels**

```tsx
import type { PageOverridesMap } from "@/types";
import { resolveText } from "@/lib/page-content/resolve";

interface HomeHeroProps {
  overrides: PageOverridesMap;
  locale: "fr" | "en";
}

export function HomeHero({ overrides, locale }: HomeHeroProps) {
  const t = useTranslations("home.hero");
  const rt = (key: string) => resolveText(overrides, `hero.${key}`, t(key), locale);

  // ... puis, partout où le JSX appelait t("badge"), t("titleLine1"), etc. :
  //   {t("badge")}              devient   {rt("badge")}
  //   {t("titleLine1")}         devient   {rt("titleLine1")}
  //   {t("titleLine2")} etc.
  //   {t("baseline")}           devient   {rt("baseline")}
  //   {t("slogan")}             devient   {rt("slogan")}
  //   {t("subtitle")}           devient   {rt("subtitle")}
  //   {t("discoverRating")}     devient   {rt("discoverRating")}
  //   {t("requestEvaluation")}  devient   {rt("requestEvaluation")}
  //   {t("trustIndicator")}     devient   {rt("trustIndicator")}
  //   {t(badge.key)} dans ratingBadges.map(...) devient {rt(badge.key)}
  //   (vigiScore/tripleA restent t() natif : non listes dans le schema home.ts
  //    car ce sont des micro-libelles du visuel abstrait, pas du contenu editorial)
}
```

Le composant garde `"use client"` (les boutons ont des interactions) ; seule
la lecture du texte change de source.

- [ ] **Step 3: Verifier**

Run: `npx tsc --noEmit` puis `npm run build`
Expected: 0 erreur, build vert, aucune page en erreur.

- [ ] **Step 4: Controle navigateur — comportement par defaut**

`npm run dev`, ouvrir `/fr` : le hero affiche exactement le meme texte
qu'avant (aucune surcharge en base). Ouvrir `/en` : idem en anglais.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(public)/page.tsx" src/components/sections/home/HomeHero.tsx
git commit -m "feat(home): hero pilote sur le mecanisme de contenu editable"
```

---

### Task 10: Câbler `AboutRSE.tsx` (texte + image)

**Files:**
- Modify: `src/app/[locale]/(public)/a-propos/page.tsx`
- Modify: `src/components/sections/about/AboutRSE.tsx`

**Interfaces:**
- Consumes: `resolveText`/`resolveImage` (`@/lib/page-content/resolve`), `loadPageOverrides` (`@/lib/page-content/server`).

- [ ] **Step 1: Charger les overrides dans la page `a-propos` et les transmettre**

Meme schema qu'a l'etape precedente : `loadPageOverrides("a-propos")` dans le
composant serveur de la page, passe en prop a `AboutRSE` (et, dans les taches
suivantes, aux autres sections de la page).

- [ ] **Step 2: Modifier `AboutRSE.tsx`**

```tsx
import type { PageOverridesMap } from "@/types";
import { resolveText, resolveImage } from "@/lib/page-content/resolve";

interface AboutRSEProps {
  overrides: PageOverridesMap;
  locale: "fr" | "en";
}

export function AboutRSE({ overrides, locale }: AboutRSEProps) {
  const t = useTranslations("about.rse");
  const rt = (key: string) => resolveText(overrides, `rse.${key}`, t(key), locale);

  // {t("badge")}        -> {rt("badge")}
  // {t("subtitle")}     -> {rt("subtitle")}
  // {t("partnerTitle")} -> {rt("partnerTitle")}
  // {t("paragraph1")}   -> {rt("paragraph1")}
  // {t("paragraph2")}   -> {rt("paragraph2")}
  // t.rich("heading", ...) reste tel quel (exclu, voir Global Constraints)

  const logoSrc = resolveImage(overrides, "rse.logo", "/images/partners/esf-logo.png");
  // <Image src="/images/partners/esf-logo.png" .../>  ->  <Image src={logoSrc} .../>
}
```

- [ ] **Step 3: Verifier**

Run: `npx tsc --noEmit` puis `npm run build`
Expected: 0 erreur, build vert.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/(public)/a-propos/page.tsx" src/components/sections/about/AboutRSE.tsx
git commit -m "feat(a-propos): pilote image editable sur le logo partenaire RSE"
```

---

### Task 11: Vérification du pilote — édition réelle en admin

**Files:** aucun fichier modifie (verification uniquement)

- [ ] **Step 1:** `npm run dev`, se connecter admin, ouvrir `/fr/admin/settings/pages`.

- [ ] **Step 2:** Sur `home`, modifier `hero.badge`, enregistrer.

- [ ] **Step 3:** Ouvrir `/fr` dans un autre onglet : le badge du hero reflete la
nouvelle valeur. Ouvrir `/en` : le badge reste inchange (EN non edite, mirroir
de l'ancien FR au premier enregistrement — comportement attendu, documente
dans Global Constraints).

- [ ] **Step 4:** Cliquer "Revenir au texte par defaut" sur `hero.badge` :
`/fr` affiche de nouveau le texte `next-intl` d'origine.

- [ ] **Step 5:** Repeter les etapes 2-4 sur `a-propos` / `rse.logo` (upload
d'une image de test, verification sur `/fr/a-propos`, puis retrait).

- [ ] **Step 6:** `npx tsc --noEmit && npm run build && npx vitest run`
Expected: tout vert. Ce palier valide le mecanisme — les taches suivantes le
repetent sans le remettre en question.

---

## PHASE C — Listes structurées (brique 1)

> `founders` et `organizations` sont **déjà** en base (verifie dans le code
> existant) — seuls `values`, `pillars`, `services` restent a migrer.
> `navigation` reste en JSON (decision actee, voir Global Constraints).

### Task 12: Migrer `values` (liste la plus simple — établit le patron)

**Files:**
- Create: `supabase/migrations/20260907000003_values_table.sql`
- Create: `src/lib/repo/values.repo.ts`
- Create: `src/app/[locale]/admin/settings/values/page.tsx`
- Create: `src/components/features/admin/ValueFormDialog.tsx`
- Modify: `src/lib/vitrine-data.ts` (ajouter `loadValues`)
- Modify: `src/components/sections/about/AboutValues.tsx` (ou `HomePillars`/section
  consommatrice — verifier a l'execution quel composant lit `getValues()` de
  `data-loader.ts` et le brancher sur `loadValues()`)
- Modify: `src/components/features/admin/AdminSidebar.tsx` (ajouter "Valeurs")

**Interfaces:**
- Produces: table `public.values(id uuid, title jsonb, description jsonb, icon text, sort_order int, visible boolean)`, `listAllValues()`, `updateValue()`, `loadValues(locale)`.

- [ ] **Step 1: Migration (mirroir exact de `founders`, colonnes issues de `src/data/mocks/fr/values.json`)**

```sql
-- ============================================================================
-- CETé — table values (section "Nos valeurs", ex-JSON statique)
-- ============================================================================

create table if not exists public.values (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,        -- {fr, en}
  description jsonb not null,        -- {fr, en}
  icon        text not null,
  sort_order  int not null default 999,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.values enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'values' and policyname = 'values_admin_all'
  ) then
    create policy "values_admin_all" on public.values
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'values' and policyname = 'values_public_select'
  ) then
    create policy "values_public_select" on public.values
      for select using (visible = true);
  end if;
end $$;

-- Seed depuis src/data/mocks/fr/values.json (idempotent via id fixe)
insert into public.values (id, title, description, icon, sort_order) values
  ('00000000-0000-0000-0001-000000000001',
   '{"fr":"Independance","en":"Independence"}',
   '{"fr":"Aucun lien commercial avec les prestataires ou fournisseurs evalues. Notre notation est libre de tout conflit d''interet.","en":"No commercial ties to the vendors or providers being assessed. Our rating is free of any conflict of interest."}',
   'shield', 1),
  ('00000000-0000-0000-0001-000000000002',
   '{"fr":"Confidentialite","en":"Confidentiality"}',
   '{"fr":"Vos donnees, vos resultats et votre notation restent strictement confidentiels. Communication anonymisee sur demande.","en":"Your data, results and rating remain strictly confidential. Anonymized communication available on request."}',
   'lock', 2),
  ('00000000-0000-0000-0001-000000000003',
   '{"fr":"Objectivite","en":"Objectivity"}',
   '{"fr":"Referentiel structure, criteres mesurables, methodologie reproductible. Chaque notation repose sur des faits, pas sur des impressions.","en":"Structured framework, measurable criteria, reproducible methodology. Every rating is based on facts, not impressions."}',
   'heart', 3),
  ('00000000-0000-0000-0001-000000000004',
   '{"fr":"Progression","en":"Progression"}',
   '{"fr":"La notation n''est pas une sanction. C''est un point de depart. Chaque organisation peut progresser vers le AAA avec un accompagnement adapte.","en":"The rating is not a penalty. It is a starting point. Every organization can progress toward AAA with the right support."}',
   'target', 4)
on conflict (id) do nothing;
```

- [ ] **Step 2: Appliquer au SQL Editor Supabase**

- [ ] **Step 3: Repo**

```ts
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import { RepoError } from "@/types/repo-error";

type ValueRow = Database["public"]["Tables"]["values"]["Row"];
type ValueUpdate = Database["public"]["Tables"]["values"]["Update"];

export interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  visible: boolean;
}

type I18nStr = { fr: string; en: string };
const pickStr = (j: unknown): string => (j as Partial<I18nStr> | null)?.fr ?? "";
const enStr = (j: unknown): string | undefined => (j as Partial<I18nStr> | null)?.en;
const mergeStr = (current: unknown, fr: string): I18nStr => ({ fr, en: enStr(current) ?? fr });

function rowToValue(r: ValueRow): ValueItem {
  return {
    id: r.id,
    title: pickStr(r.title),
    description: pickStr(r.description),
    icon: r.icon,
    sortOrder: r.sort_order,
    visible: r.visible,
  };
}

export async function listAllValues(): Promise<ValueItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("values").select("*").order("sort_order", { ascending: true });
  if (error) throw new RepoError("Impossible de charger les valeurs", "values", "list");
  return (data ?? []).map(rowToValue);
}

export async function updateValue(id: string, updates: Partial<ValueItem>): Promise<ValueItem | null> {
  const supabase = createClient();
  const { data: cur } = await supabase.from("values").select("*").eq("id", id).maybeSingle();
  const patch: ValueUpdate = {};
  if (updates.title !== undefined) patch.title = mergeStr(cur?.title, updates.title);
  if (updates.description !== undefined) patch.description = mergeStr(cur?.description, updates.description);
  if (updates.icon !== undefined) patch.icon = updates.icon;
  if (updates.visible !== undefined) patch.visible = updates.visible;
  const { data, error } = await supabase.from("values").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw new RepoError("Impossible de modifier la valeur", "values", "update");
  return data ? rowToValue(data) : null;
}
```

Note : `Database["public"]["Tables"]["values"]` n'existe pas encore dans
`src/lib/supabase/database.types.ts` (fichier genere) — regenerer les types
apres la migration (`npx supabase gen types typescript` si la CLI est liee, ou
ajouter la definition a la main dans la section `Tables` en suivant le format
de `founders` juste au-dessus). Sans ca, `tsc` echouera sur `Database["public"]["Tables"]["values"]`.

- [ ] **Step 4: Page admin + dialog (copie de `team/page.tsx` + `FounderFormDialog.tsx`, simplifiee : titre + description + icone, pas de photo)**

Suivre exactement la structure de `src/app/[locale]/admin/team/page.tsx` et
`src/components/features/admin/FounderFormDialog.tsx`, en remplacant les
champs par `title`/`description`/`icon`, et `toggleFounderVisibility` par
l'equivalent sur `values` (a ajouter au repo : `toggleValueVisibility`, meme
implementation que `toggleFounderVisibility` dans `founders.repo.ts`).

- [ ] **Step 5: `loadValues` dans `vitrine-data.ts`**

```ts
export async function loadValues(locale: Locale): Promise<{ id: string; title: string; description: string; icon: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("values").select("*").eq("visible", true).order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return getValuesStatic(locale);
    return data.map((r) => ({
      id: r.id,
      title: pick(r.title, locale, ""),
      description: pick(r.description, locale, ""),
      icon: r.icon,
    }));
  } catch {
    return getValuesStatic(locale);
  }
}
```
(`getValuesStatic` = `getValues` de `data-loader.ts`, importe sous cet alias
comme `getFoundersStatic`.)

- [ ] **Step 6: Brancher le composant consommateur**

Chercher `getValues(` dans les composants (`grep -rn "getValues(" src/components`)
et remplacer l'appel synchrone par la prop `values` chargee via `loadValues`
dans le composant serveur parent (meme schema que founders/organizations).

- [ ] **Step 7: Ajouter au sidebar**

```ts
{ label: "Valeurs", href: "/admin/settings/values", icon: Heart },
```

- [ ] **Step 8: Verifier**

Run: `npx tsc --noEmit && npm run build`
Expected: 0 erreur, build vert. Controle navigateur : `/fr/a-propos` (ou la
page qui affiche les valeurs) montre les 4 valeurs, identiques au JSON
d'origine ; `/admin/settings/values` permet de modifier un titre et de le voir
refleter sur la vitrine.

- [ ] **Step 9: Commit**

```bash
git add supabase/migrations/20260907000003_values_table.sql src/lib/repo/values.repo.ts "src/app/[locale]/admin/settings/values/page.tsx" src/components/features/admin/ValueFormDialog.tsx src/lib/vitrine-data.ts src/components/features/admin/AdminSidebar.tsx
git commit -m "feat(values): migration vers Supabase avec repli JSON"
```

---

### Task 13: Migrer `pillars` (même patron que Task 12)

**Files:** memes fichiers que Task 12, prefixe `pillars`/`Pillar`.

**Deltas par rapport a `values` :**
- Colonnes identiques + `color text not null` (valeurs JSON existantes :
  `"blue"`, `"yellow"`, `"green"` — voir `src/data/mocks/fr/pillars.json`).
- Seed : 3 lignes (`pillar-1` Evaluer, `pillar-2` Noter, `pillar-3` Accompagner
  — copier titre/description/icon/color du JSON existant).
- Repo : `src/lib/repo/pillars.repo.ts`, memes fonctions que `values.repo.ts`
  plus le champ `color`.
- Admin : `/admin/settings/pillars`, `PillarFormDialog.tsx`.
- `loadPillars(locale)` dans `vitrine-data.ts`.
- Sidebar : `{ label: "Piliers", href: "/admin/settings/pillars", icon: Zap }`.

- [ ] **Step 1-9 : repeter exactement les etapes de Task 12** en substituant
`values`→`pillars`, `Value`→`Pillar`, et en ajoutant la colonne/le champ
`color` partout ou `icon` apparait dans Task 12.

- [ ] **Step 10: Commit**

```bash
git commit -m "feat(pillars): migration vers Supabase avec repli JSON"
```

---

### Task 14: Migrer `services` (patron identique, table plus riche)

**Files:** memes fichiers que Task 12, prefixe `services`/`Service`.

**Deltas par rapport a `values`** (voir `src/data/mocks/fr/services.json`,
9 elements) :
- Colonnes : `category text not null` (`"Expertise"` | `"Conseil"`), `type
  text not null` (`"expertise"` | `"service"`), `is_pillar boolean not null
  default false`, `title jsonb`, `description jsonb`, `short_description
  jsonb`, `features jsonb not null default '{"fr":[],"en":[]}'::jsonb` (meme
  forme que `specialties` sur `founders`), `icon text not null`, `image_url
  text not null default ''`.
- Seed : les 9 entrees du JSON (`exp-dps`, `exp-save`, `srv-campus`,
  `srv-pass-vip`, `exp-vigi`, `srv-coach-mgr`, `srv-coach-tst`,
  `srv-coach-encad`, `srv-form-orgs`), colonnes mappees terme a terme depuis
  le JSON (id conserve comme cle primaire text, pas uuid genere — ce sont des
  identifiants stables deja references potentiellement ailleurs).
- Repo : `src/lib/repo/services.repo.ts` — `features` traite comme
  `specialties` dans `founders.repo.ts` (`pickArr`/`mergeArr`).
- Admin : `/admin/settings/services`, `ServiceFormDialog.tsx` — le formulaire
  de features (tableau de chaines) n'a pas d'equivalent existant dans le code
  (specialties de `founders` n'est pas editable dans `FounderFormDialog`) :
  utiliser un `Textarea` avec une ligne par feature (split sur `\n` a la
  sauvegarde, join sur `\n` a l'affichage) — solution la plus simple, pas de
  nouveau composant de liste dynamique.
- `loadServices(locale)`, `loadExpertiseServices`, `loadConseilServices`,
  `loadPillarServices` dans `vitrine-data.ts` (memes filtres que
  `data-loader.ts` : `category`, `pillar`).
- Sidebar : `{ label: "Services", href: "/admin/settings/services", icon: Briefcase }`
  (icone deja importee).

- [ ] **Step 1-9 : repeter la structure de Task 12** avec les deltas ci-dessus.

- [ ] **Step 10: Verifier specifiquement les 4 pages qui consomment
`getServices`/`getExpertiseServices`/`getConseilServices`/`getPillarServices`**
(`grep -rn "getServices\|getExpertiseServices\|getConseilServices\|getPillarServices" src/components src/app`)
— chacune doit recevoir la liste chargee cote serveur au lieu de l'appel
synchrone.

- [ ] **Step 11: Commit**

```bash
git commit -m "feat(services): migration vers Supabase avec repli JSON"
```

---

## PHASE D — Déploiement du texte/image éditable sur les pages restantes

> Règle commune à toutes les tâches de cette phase : ouvrir chaque fichier
> listé, vérifier les clés `t("...")` contre la liste donnée (elle vient d'un
> grep réel sur le code au moment d'écrire ce plan — une clé peut avoir changé
> entre-temps, vérifier avant d'appliquer), exclure tout `t.rich(...)`/`t.raw(...)`
> et tout libellé fonctionnel (validation, aria, toast, placeholder lié au
> comportement). Le renommage suit le même schéma que Task 9/10 : composant
> reçoit `overrides`/`locale` en prop (ou les charge lui-même si déjà un
> composant serveur), `const rt = (k) => resolveText(overrides, "prefix.k",
> t(k), locale)`, remplacer chaque `t("x")` marketing par `rt("x")`.
> Fin de tâche systématique : `npx tsc --noEmit && npm run build`, puis un
> aller-retour d'édition dans `/admin/settings/pages` sur au moins un champ de
> la page, suivi d'une réinitialisation.

### Task 15: Page `services` — schéma + câblage

**Files:**
- Create: `src/lib/page-content/pages/services.ts`
- Modify: `src/lib/page-content/index.ts` (ajouter `services` à `PAGE_CONTENT_SCHEMA`/`PAGE_LABELS`)
- Modify: `src/app/[locale]/(public)/services/page.tsx`
- Modify: `src/components/sections/services/ServicesHero.tsx`, `ServicesApproach.tsx`, `ServicesCatalog.tsx`, `ServicesPillars.tsx`, `ServicesProcess.tsx`, `ServicesCTA.tsx`

**Champs (prefixe = nom de section sans "Services", en camelCase court) :**

| Composant | Prefixe | Clés |
|---|---|---|
| ServicesHero | `hero` | badge, heading, description, subdescription, discoverRating, contactUs |
| ServicesApproach | `approach` | badge, heading, watermark, anchor1Title, anchor1Subtitle, anchor1Desc, anchor2Title, anchor2Subtitle, anchor2Desc, anchor3Title, anchor3Subtitle, anchor3Desc, learnMore |
| ServicesCatalog | `catalog` | badge, heading, description (le catalogue lui-même vient de la table `services`, brique 1 — ne pas dupliquer `popular`/`requestQuote`, ce sont des libellés UI génériques) |
| ServicesPillars | `pillars` | heading, description (expertise/conseil/contactUs sont des libellés d'onglet fonctionnels, exclus) |
| ServicesProcess | `process` | heading, description |
| ServicesCTA | `cta` | heading, description, ourRating, requestEvaluation |

- [ ] **Step 1:** Écrire `services.ts` avec ces 24 champs (même forme que Task 7).
- [ ] **Step 2:** Ajouter `services` à l'agrégateur.
- [ ] **Step 3:** Charger `loadPageOverrides("services")` dans `page.tsx`, le
  distribuer aux 6 composants (props `overrides`/`locale`).
- [ ] **Step 4:** Appliquer la substitution `t(x)` → `rt(x)` dans chacun,
  selon la table ci-dessus.
- [ ] **Step 5:** Vérifier (tsc, build, browser round-trip).
- [ ] **Step 6:** Commit `feat(services-page): contenu editable`.

---

### Task 16: Page `expertise` — schéma + câblage

**Files:**
- Create: `src/lib/page-content/pages/expertise.ts`
- Modify: `src/lib/page-content/index.ts`
- Modify: `src/app/[locale]/(public)/expertise/page.tsx`
- Modify: les 9 fichiers de `src/components/sections/expertise/`

**Champs (prefixe = nom de section sans "Expertise") :**

| Composant | Prefixe | Clés |
|---|---|---|
| ExpertiseHero | `hero` | badge, heading, description, subheading.part1, subheading.part2, subheading.part3, cta1, cta2 |
| ExpertiseCertificate | `certificate` | badge, heading, description, differenceHeading, differenceDescription, cta1, cta2 |
| ExpertiseComparison | `comparison` | badge, heading, headingTalents, columnTheme, columnTalents, columnVulnerables, gapBadge, gapHeading, gapHeadingHighlight |
| ExpertiseOMT | `omt` | badge, heading, headingHighlight, description, cta |
| ExpertiseServices | `services` | badge, heading, description, learnMore |
| ExpertiseTertiles | `tertiles` | badge, heading, headingHighlight, description, note |
| ExpertiseVigiScore | `vigiScore` | badge, headingPrefix, description, assemblyHeading, assemblyHighlight, resultLabel, resultDescription, tendencyHeading, tendencyDescription |
| ExpertiseVigilance | `vigilance` | badge, headingVulnerability, headingVigilance, vulnerabilityTitle, vulnerabilityDescription, vigilanceTitle, vigilanceDescription, gaugeLow, gaugeVulnerability, gaugeVigilance, gaugeHigh, ncHeading, ncHeadingHighlight, ncDescription |
| ExpertiseCTA | `cta` | badge, heading, description, cta1, cta2 |

- [ ] **Step 1-6 : même déroulé que Task 15** (46 champs au total).
- [ ] Commit `feat(expertise-page): contenu editable`.

---

### Task 17: Page `contact` — schéma + câblage (partie éditoriale seulement)

**Files:**
- Create: `src/lib/page-content/pages/contact.ts`
- Modify: `src/lib/page-content/index.ts`
- Modify: `src/app/[locale]/(public)/contact/page.tsx`
- Modify: `ContactHero.tsx`, `ContactMap.tsx`, `ContactSidebar.tsx`, `ContactTrust.tsx`
  (`ContactMain.tsx`/`ContactFormFields.tsx` exclus : logique de formulaire et
  bascule d'onglet, pas du contenu editorial)

**Champs :**

| Composant | Prefixe | Clés |
|---|---|---|
| ContactHero | `hero` | badge, heading, description |
| ContactMap | `map` | heading (`openGoogleMaps` = libelle fonctionnel, exclu) |
| ContactSidebar | `sidebar` | howItWorks, step1Title, step1Desc, step2Title, step2Desc, step3Title, step3Desc, coordinates (les `chip*` sont des tags courts redondants avec le catalogue services — exclus pour eviter la duplication) |
| ContactTrust | `trust` | item1Title, item1Desc, item2Title, item2Desc, item3Title, item3Desc |

- [ ] **Step 1-6 : même déroulé** (16 champs).
- [ ] Commit `feat(contact-page): contenu editable`.

---

### Task 18: Page `blog` (index) — schéma + câblage

**Files:**
- Create: `src/lib/page-content/pages/blog.ts`
- Modify: `src/lib/page-content/index.ts`
- Modify: `src/app/[locale]/(public)/blog/page.tsx`
- Modify: `BlogHero.tsx`, `BlogFeatured.tsx`, `BlogCTA.tsx`
  (`BlogCard.tsx`/`BlogFilter.tsx`/`ArticleLayout.tsx`/`ArticleBody.tsx`/`VizActContent.tsx`
  exclus : ils affichent des articles individuels, deja geres par
  `articles.repo.ts`)

**Champs :**

| Composant | Prefixe | Clés |
|---|---|---|
| BlogHero | `hero` | badge, headingStart, headingEnd, description (`count` est calcule, exclu) |
| BlogFeatured | `featured` | label (`readArticle` est un libelle UI generique repete par carte, exclu) |
| BlogCTA | `cta` | heading, description (`consent`, `emailPlaceholder`, `submit`, `sending`, `successTitle`, `successDesc`, `errorTitle`, `errorDesc`, `privacyLink`, `validation.*` sont fonctionnels/transactionnels, exclus) |

- [ ] **Step 1-6 : même déroulé** (5 champs — page volontairement peu
  personnalisable, l'essentiel de son contenu est la liste d'articles deja
  editable via l'admin blog existant).
- [ ] Commit `feat(blog-page): contenu editable`.

---

### Task 19: Pages `glossaire` et `observatoire` — hero/intro uniquement

**Files:**
- Create: `src/lib/page-content/pages/glossaire.ts`
- Create: `src/lib/page-content/pages/observatoire.ts`
- Modify: `src/lib/page-content/index.ts`
- Modify: `src/app/[locale]/(public)/glossaire/page.tsx`
- Modify: `src/app/[locale]/(public)/observatoire/page.tsx`

**Champs `glossaire`** (le reste de la page vient de `src/data/glossary.ts`,
hors perimetre — c'est un jeu de definitions metier, pas du texte de page) :

| Prefixe | Clés |
|---|---|
| `hero` | badge, heading, description |

**Champs `observatoire`** (les clés `tertiles.*` reprennent mot pour mot les
définitions déjà utilisées par `ExpertiseTertiles` sur `/expertise` via les
mêmes clés `messages.json` — les exposer ici créerait deux copies
indépendamment éditables du même texte méthodologique et les ferait diverger.
Exclues tant que les clés i18n ne sont pas unifiées entre les deux pages,
changement plus large hors périmètre de cette fonctionnalité) :

| Prefixe | Clés |
|---|---|
| `hero` | badge, heading, description |
| `page` | intro, note (le `method.heading`/`stats.heading`/`links.*` restent statiques : libelles de section tres courts, peu de valeur a les rendre editables) |

- [ ] **Step 1-6 : même déroulé, deux pages traitées dans la même tâche**
  (ce sont deux `page.tsx` sans sections dédiées — le remplacement `t(x)` →
  `rt(x)` se fait directement dans le fichier de page, composant serveur, donc
  `loadPageOverrides` s'appelle directement dedans, pas besoin de props).
- [ ] Commit `feat(glossaire-observatoire): hero et intro editables`.

---

### Task 20: Page `connexion` — hero/panneau de marque uniquement

**Files:**
- Create: `src/lib/page-content/pages/connexion.ts`
- Modify: `src/lib/page-content/index.ts`
- Modify: `src/app/[locale]/connexion/page.tsx`
- Modify: `LoginBrandPanel.tsx`, `LoginMobileHead.tsx`

**Champs** (le corps du formulaire — labels, placeholders, messages toast,
aria — reste hors périmètre : ce sont des libellés fonctionnels/accessibilité
d'un flux d'authentification, pas du contenu éditorial ; `VigiScale.tsx` et
`login-trust.tsx` n'exposent aucune clé `t()` simple à l'inspection — vérifier
à l'exécution s'ils contiennent du texte à exposer) :

| Composant | Prefixe | Clés |
|---|---|---|
| page.tsx (connexion) | `form` | heading, subtitle |
| LoginBrandPanel | `brand` | eyebrow, sub, titleLine1, titleLine2, vigiTitle, vigiCaption |

- [ ] **Step 1-6 : même déroulé** (8 champs). `page.tsx` est un composant
  client (`useTranslations`, pas `getTranslations`) — suivre le même schéma
  que Task 9 (props depuis un parent serveur, ou — si aucun parent serveur
  n'englobe la page de connexion — ajouter un appel serveur dans le
  `layout.tsx` du dossier `connexion/` qui charge `loadPageOverrides("connexion")`
  et le transmet ; vérifier la structure réelle de
  `src/app/[locale]/connexion/layout.tsx` avant d'écrire le code, elle n'a pas
  été inspectée pendant la planification).
- [ ] Commit `feat(connexion-page): contenu editable`.

---

## PHASE E — Régression finale

### Task 21: Vérification complète + rapport

**Files:** aucun fichier modifie.

- [ ] **Step 1:** `npx tsc --noEmit` → 0 erreur.
- [ ] **Step 2:** `npm run build` → vert, aucune route en erreur (le compteur
  de routes doit être ≥ celui d'avant le chantier, jamais inférieur).
- [ ] **Step 3:** `npx vitest run` → tous les tests passent, y compris
  `resolve.test.ts`.
- [ ] **Step 4:** `npm run dev`, parcours navigateur complet en FR puis EN :
  `/`, `/a-propos`, `/services`, `/expertise`, `/contact`, `/blog`,
  `/glossaire`, `/observatoire`, `/connexion` — chaque page s'affiche
  normalement (aucune surcharge en base ne doit avoir été laissée d'un test
  precedent : repasser sur `/admin/settings/pages` et vérifier qu'aucun champ
  n'est marqué personnalisé, sinon réinitialiser).
- [ ] **Step 5:** Dans `/admin`, vérifier les 3 nouvelles pages CRUD
  (`/admin/settings/values`, `/admin/settings/pillars`,
  `/admin/settings/services`) : la liste affichée correspond aux données du
  JSON d'origine, une modification se reflète sur la vitrine.
- [ ] **Step 6:** `git log --oneline` depuis `2530282` (commit de la spec) :
  vérifier qu'aucun commit n'a été oublié et qu'aucun `git push` n'a été
  exécuté (`git status` doit montrer `master` en avance sur `origin/master`,
  jamais synchronisé).
- [ ] **Step 7:** Rédiger le rapport final (dans la réponse à l'utilisateur,
  pas un fichier) listant : ce qui est éditable, ce qui a été explicitement
  exclu et pourquoi (`legal`/`cgu`/`privacy`, `verifier`, `navigation`, champs
  fonctionnels, tertiles dupliqués), et le nombre de commits locaux en attente
  de revue avant un éventuel push.
