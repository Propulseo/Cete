"use client";

import { createContext, useContext } from "react";
import type { Client } from "@/types/client";

const ClientContext = createContext<Client | null>(null);

export function ClientProvider({ client, children }: { client: Client; children: React.ReactNode }) {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

export function useClient(): Client {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used within ClientProvider");
  return ctx;
}
