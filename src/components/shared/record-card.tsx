// RecordCard — représentation mobile d'une ligne de tableau.
//
// Un tableau de 6 à 8 colonnes n'est pas réductible à 360px : le rendre scrollable
// horizontalement ne fait que déplacer le problème (la colonne « Actions », toujours en
// dernier, reste hors du champ visible). On retourne donc la ligne en fiche verticale :
// identité en tête, attributs en paires libellé/valeur, actions en pied — chacune à sa
// taille tactile. Le tableau reste la vue de référence à partir de `lg`, où la densité
// redevient un avantage.
//
// Usage type dans un composant de table :
//   <div className="hidden lg:block"><DataTable>…</DataTable></div>
//   <RecordCardList className="lg:hidden">{rows.map(r => <RecordCard … />)}</RecordCardList>
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RecordCardList({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}

interface RecordCardProps {
  /** Pastille d'icône affichée à gauche du titre. */
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Badges de statut / catégorie, sur une ligne repliable sous l'identité. */
  badges?: ReactNode;
  /** Attributs secondaires, rendus en grille 2 colonnes. */
  fields?: { label: string; value: ReactNode }[];
  /** Boutons d'action, en pied de fiche. */
  actions?: ReactNode;
  /**
   * Rend la fiche entière activable. On ne peut pas envelopper la carte dans un <button>
   * (les actions du pied sont elles-mêmes des boutons — imbrication invalide) : on
   * superpose donc une cible transparente en fond, et on remonte le pied au-dessus.
   */
  onActivate?: () => void;
  /** Libellé accessible de la cible plein-carte ; requis avec `onActivate`. */
  activateLabel?: string;
  className?: string;
}

export function RecordCard({
  icon,
  title,
  subtitle,
  badges,
  fields,
  actions,
  onActivate,
  activateLabel,
  className,
}: RecordCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[10px] border border-[var(--admin-line)] bg-card p-4 shadow-[var(--surface-shadow)]",
        className,
      )}
    >
      {onActivate && (
        <button
          type="button"
          onClick={onActivate}
          aria-label={activateLabel}
          className="absolute inset-0 z-0 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}

      <div className="pointer-events-none relative flex items-start gap-3">
        {icon}
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug text-foreground">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {badges && (
        <div className="pointer-events-none relative mt-3 flex flex-wrap items-center gap-2">{badges}</div>
      )}

      {fields && fields.length > 0 && (
        <dl className="pointer-events-none relative mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[var(--admin-line)] pt-3">
          {fields.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                {f.label}
              </dt>
              <dd className="mt-0.5 text-sm text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {actions && (
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--admin-line)] pt-3">
          {actions}
        </div>
      )}
    </div>
  );
}
