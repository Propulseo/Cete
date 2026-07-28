import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// NativeSelect — <select> natif habillé comme <Input>. On garde délibérément le picker
// natif (roue iOS / bottom sheet Android) : c'est la meilleure expérience tactile, et
// aucun menu custom ne l'égale au doigt. Le composant ne corrige que la géométrie, restée
// en valeurs desktop dans tout l'admin :
//   • h-11 (44px) sous `sm` → cible tactile conforme, sm:h-9 garde la densité desktop ;
//   • text-base sous `md` → Safari iOS zoome sur tout champ dont la police descend sous
//     16px, ce qui décalait la page à chaque ouverture de filtre.
// `appearance-none` + chevron dessiné : sans ça le triangle natif varie d'un OS à l'autre
// et la hauteur imposée n'est pas respectée partout.
function NativeSelect({
  className,
  wrapperClassName,
  children,
  ...props
}: React.ComponentProps<"select"> & { wrapperClassName?: string }) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <select
        data-slot="native-select"
        className={cn(
          "border-input dark:bg-input/30 h-11 w-full min-w-0 appearance-none rounded-md border bg-transparent py-1 pl-3 pr-9 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        strokeWidth={1.75}
        className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
      />
    </div>
  )
}

export { NativeSelect }
