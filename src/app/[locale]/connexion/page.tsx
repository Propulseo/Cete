import { loadPageOverrides } from "@/lib/page-content/server";
import { PortailPageClient } from "./PortailPageClient";

export default async function ConnexionPage() {
  const overrides = await loadPageOverrides("connexion");
  return <PortailPageClient overrides={overrides} />;
}
