import { notFound } from "next/navigation";

// Catch-all : toute URL inconnue sous une locale valide rend la 404 localisée
// ([locale]/not-found.tsx) avec un vrai statut 404.
export default function CatchAllPage() {
  notFound();
}
