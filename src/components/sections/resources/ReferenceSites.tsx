import { ExternalLink, Globe } from "lucide-react";
import type { Resource } from "@/types/resource";

/**
 * Section « Sites de référence & partenaires » de la page Ressources client.
 * Rend les ressources de catégorie `partenaires` (type lien) sous forme de
 * cartes-liens externes (vrais <a> accessibles, ouverture nouvel onglet).
 */
export function ReferenceSites({ title, sites }: { title: string; sites: Resource[] }) {
  if (sites.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <Globe className="size-4" strokeWidth={1.75} />
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-lg border border-[var(--admin-line)] bg-card p-4 transition hover:border-primary/40 hover:shadow-[0_2px_8px_rgba(26,41,64,0.08)]"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
              <ExternalLink className="size-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground line-clamp-1 group-hover:text-primary">
                {site.title}
              </p>
              {site.description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{site.description}</p>
              )}
              {site.source && (
                <p className="mt-1 truncate text-label text-muted-foreground/80">{site.source}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
