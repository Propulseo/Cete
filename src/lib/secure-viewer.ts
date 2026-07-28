// Ouverture d'un document en lecture seule.
//
// Historique : la version précédente écrivait une pop-up contenant une <iframe>
// pointant sur l'URL signée. L'impression n'était en pratique jamais bloquée —
// l'iframe étant d'origine différente, ni Ctrl+P ni le clic droit ne remontaient
// au parent, et #toolbar=0 n'est honoré que par Chrome/Edge. On passe désormais
// par une route interne qui redessine le document en canvas : plus de lecteur
// PDF natif, donc plus de chemin d'impression hors de notre contrôle.

import type { StorageBucket } from "@/lib/supabase/storage";

export interface SecureViewerTarget {
  title: string;
  /** Objet Storage (cas nominal). */
  bucket?: StorageBucket;
  path?: string;
  /** Chemin same-origin (jeux de données de démo, sans Storage). */
  src?: string;
}

/**
 * Ouvre la visionneuse dans un onglet dédié.
 * @returns `false` si la pop-up a été bloquée par le navigateur.
 */
export function openSecureViewer(target: SecureViewerTarget): boolean {
  const params = new URLSearchParams({ t: target.title });
  if (target.bucket && target.path) {
    params.set("b", target.bucket);
    params.set("p", target.path);
  } else if (target.src) {
    params.set("u", target.src);
  }

  // La locale est lue sur <html lang> (posée par le layout) : window.open ne
  // passe pas par la navigation next-intl, un chemin sans préfixe retomberait
  // sur /fr.
  const locale = document.documentElement.lang || "fr";
  const viewer = window.open(`/${locale}/viewer?${params.toString()}`, "_blank");
  return Boolean(viewer);
}
