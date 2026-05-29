"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

/** Vérifie que l'appelant est un admin authentifié (la service-role bypasse la RLS). */
async function assertAdmin(): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") throw new Error("Action réservée aux administrateurs");
}

export async function createUserAction(input: {
  email: string;
  password: string;
  name: string;
  role: "admin" | "client";
  clientId?: string;
  company?: string;
}): Promise<{ id: string }> {
  await assertAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      name: input.name,
      role: input.role,
      client_id: input.clientId ?? "",
      company: input.company ?? "",
    },
  });
  if (error || !data.user) throw new Error(error?.message ?? "Création du compte impossible");
  return { id: data.user.id };
}

export async function deleteUserAction(id: string): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
}
