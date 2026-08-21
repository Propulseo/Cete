// Composant serveur : émet un bloc <script type="application/ld+json"> dans le
// HTML SSR (lisible par curl/crawlers sans JavaScript). L'échappement de "<"
// empêche toute fermeture prématurée de la balise script par le contenu.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
