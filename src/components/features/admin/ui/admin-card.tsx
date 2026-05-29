// Moved to src/components/shared/surface-card.tsx (shared admin + client). Re-export shim
// keeping the legacy Admin* names so existing admin imports keep working.
export {
  SurfaceCard as AdminCard,
  SurfaceCardHeader as AdminCardHeader,
  SurfaceCardTitle as AdminCardTitle,
  SurfaceCardContent as AdminCardContent,
} from "@/components/shared/surface-card";
