"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Voile encré à la marque plutôt qu'un noir neutre, avec un flou très léger :
        // le contenu derrière reste identifiable (on sait d'où l'on vient) sans
        // concurrencer le panneau. 2px seulement — au-delà, le flou coûte cher pendant
        // le glissement sur mobile.
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[#1A2940]/55 backdrop-blur-[2px]",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // dvh (et non vh) : sur mobile la barre d'URL fait varier la hauteur de la
          // fenêtre ; en vh le panneau dépassait sous le pli et son pied devenait
          // inatteignable. Ouverture 320ms / fermeture 220ms en ease-out : le défaut
          // shadcn (500/300, ease-in-out) donne une impression de lourdeur au doigt.
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col shadow-2xl transition ease-out data-[state=closed]:duration-200 data-[state=open]:duration-[320ms]",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-[100dvh] w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-[100dvh] w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        {/* Survol neutre volontairement, pas `bg-accent` : ce jeton vaut l'orange de
            marque sur le site public (et un gris discret dans les portails) — une croix
            de fermeture en aplat orange criait beaucoup trop fort. */}
        {showCloseButton && (
          <SheetPrimitive.Close className="focus-visible:ring-ring absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none dark:hover:bg-white/10">
            <XIcon className="size-5" />
            <span className="sr-only">Fermer le menu</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

// Le panneau se lit en trois bandes : en-tête fixe (marque + fermeture), corps
// défilant, pied fixe. C'est le pied qui porte les actions décisives — il tombe dans
// la zone du pouce, là où l'en-tête ne va jamais sur un grand téléphone.

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex shrink-0 items-center gap-3 border-b border-[var(--admin-line,theme(colors.border))] px-4 pr-16",
        // Encoche iOS en paysage / affichage bord à bord.
        "pt-[max(0.75rem,env(safe-area-inset-top))] pb-3",
        className
      )}
      {...props}
    />
  )
}

/** Corps défilant du panneau. `overscroll-contain` empêche le scroll de « fuir » sur la page derrière. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 border-t border-[var(--admin-line,theme(colors.border))] px-3 pt-3",
        // Barre d'accueil iPhone : sans ça, la dernière action est sous le trait.
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
