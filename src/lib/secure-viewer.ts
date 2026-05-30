// Visionneuse « lecture seule » partagée.
//
// Ouvre un fichier (URL signée) dans une fenêtre dédiée où le téléchargement et
// l'impression sont bridés : barre PDF masquée (#toolbar=0), Ctrl/Cmd+P et +S
// interceptés, clic droit désactivé, @media print vidé.
//
// ⚠️ Honnêteté technique : c'est de la FRICTION UX, pas une protection
// cryptographique. Capture d'écran, DevTools, etc. restent possibles. Le fichier
// lui-même reste protégé par les RLS Storage (l'URL signée expire).
//
// NB volontaire : PAS de `noopener` dans window.open. Avec `noopener`, window.open
// renvoie `null` et l'écriture du document échoue — c'était le bug de l'ancien
// viewer (le mode lecture seule ne s'ouvrait jamais).

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Ouvre `url` dans une fenêtre lecture seule.
 * @returns `false` si la pop-up a été bloquée par le navigateur.
 */
export function openSecureViewer(
  url: string,
  opts: { title: string; badge: string },
): boolean {
  const viewer = window.open("", "_blank");
  if (!viewer) return false;

  const title = escapeHtml(opts.title);
  const badge = escapeHtml(opts.badge);

  viewer.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title} — ${badge}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1A2940; overflow: hidden; }
    .bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #0D5A8A; color: #fff; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; }
    .bar strong { font-weight: 600; }
    .bar .badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.15); padding: 2px 10px; border-radius: 999px; font-size: 11px; }
    iframe { width: 100%; height: calc(100vh - 40px); border: none; }
    @media print { body * { display: none !important; } }
  </style>
  <script>
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) { e.preventDefault(); }
    });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  </script>
</head>
<body>
  <div class="bar">
    <strong>${title}</strong>
    <span class="badge">${badge}</span>
  </div>
  <iframe src="${url}#toolbar=0&navpanes=0" title="${title}"></iframe>
</body>
</html>`);
  viewer.document.close();
  return true;
}
