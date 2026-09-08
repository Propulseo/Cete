// Extrait de vitrine-data.ts (server-only via next/headers) pour rester
// importable depuis un composant client (ArticlePreview.tsx) : aucune
// dépendance Supabase ici, uniquement la logique pure de repli d'image.

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop`;

/**
 * Visuel de repli quand l'article n'a pas de couverture en base : deux photos
 * par catégorie, choisies de façon déterministe sur le slug pour que deux
 * articles de la même catégorie n'affichent pas la même image côte à côte.
 */
export const CATEGORY_IMG: Record<string, string[]> = {
  Expertise: [U("1758101755915-462eddc23f57"), U("1615774925655-a0e97fc85c14")],
  Formation: [U("1621905251189-08b45d6a269e"), U("1660330589693-99889d60181e")],
  Réglementation: [U("1603901622056-0a5bee231395"), U("1754780960162-839cda44d736")],
  Sécurité: [U("1595831708961-1b13c0dd2422"), U("1597502310092-31cdaa35b46d")],
  Innovation: [U("1509390221805-d1c887a72a00"), U("1509390673020-a5b2450e33f1")],
  Engagement: [U("1643474003691-9dcaa22ae33c"), U("1784623305001-c7aebfc7f226")],
};

export function fallbackImage(category: string, slug: string): string {
  const pool = CATEGORY_IMG[category] ?? CATEGORY_IMG.Expertise;
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return pool[h % pool.length];
}
