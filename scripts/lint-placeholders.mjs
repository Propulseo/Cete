#!/usr/bin/env node
// lint-placeholders — interdit de publier les marqueurs [[À FOURNIR : ...]] des
// pages légales tant que le site n'est pas en production sur son domaine réel.
// Logique : le blocage ne s'applique QUE si on build pour la production AVEC le
// domaine réel (NEXT_PUBLIC_SITE_URL). En préproduction ou sans domaine défini,
// les placeholders restent autorisés (le contenu n'est pas encore versé).

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "src");
const MARKER = "[[À FOURNIR";
const PROD_DOMAIN = "cete-notation.fr";

const isProductionBuild = process.env.NODE_ENV === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const targetsRealDomain = siteUrl.includes(PROD_DOMAIN);

if (!isProductionBuild || !targetsRealDomain) {
  console.log("📏 lint-placeholders : environnement non productif, marqueurs tolérés.");
  process.exit(0);
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (/\.(tsx?|jsx?)$/.test(entry)) yield full;
  }
}

const offenders = [];
for (const file of walk(SRC)) {
  const content = readFileSync(file, "utf8");
  const line = content.split("\n").findIndex((l) => l.includes(MARKER));
  if (line !== -1) offenders.push(`${file}:${line + 1}`);
}

if (offenders.length > 0) {
  console.error("\n❌ lint-placeholders : des marqueurs [[À FOURNIR]] subsistent dans src/ !");
  console.error("   Le site est prêt à partir sur le domaine de production avec des");
  console.error("   mentions légales incomplètes. Verser les valeurs du client AVANT :");
  for (const o of offenders) console.error(`   - ${o}`);
  console.error("\n   Une fois complétées, retirer les marqueurs et relancer le build.\n");
  process.exit(1);
}

console.log("📏 lint-placeholders : aucun marqueur résiduel. OK.");
