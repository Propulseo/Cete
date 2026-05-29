import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import type {
  Client,
  ClientContact,
  ClientLegalForm,
  ClientSector,
  ClientStatus,
} from "@/types/client";
import { RepoError } from "@/types/repo-error";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type ClientContactRow = Database["public"]["Tables"]["client_contacts"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];
type ClientContactInsert = Database["public"]["Tables"]["client_contacts"]["Insert"];

type ClientRowWithContacts = ClientRow & {
  client_contacts: ClientContactRow[] | null;
};

const CLIENT_SELECT = "*, client_contacts(*)";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rowToContact(r: ClientContactRow): ClientContact {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    role: r.role,
    email: r.email ?? "",
    phone: r.phone ?? "",
    isPrimary: r.is_primary,
  };
}

function rowToClient(r: ClientRowWithContacts): Client {
  return {
    id: r.id,
    slug: r.slug,
    companyName: r.company_name,
    legalForm: r.legal_form as ClientLegalForm,
    siret: r.siret,
    vatNumber: r.vat_number ?? undefined,
    sector: r.sector as ClientSector,
    headcount: r.headcount ?? undefined,
    address: {
      street: r.address_street,
      postalCode: r.address_postal_code,
      city: r.address_city,
      country: r.address_country,
    },
    contacts: (r.client_contacts ?? []).map(rowToContact),
    status: r.status as ClientStatus,
    contractStartDate: r.contract_start_date ?? "",
    contractEndDate: r.contract_end_date ?? undefined,
    internalNotes: r.internal_notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function listClients(): Promise<Client[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    throw new RepoError("Impossible de charger les clients", "clients", "list");
  }
  return (data ?? []).map((row) => rowToClient(row as ClientRowWithContacts));
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new RepoError("Impossible de charger le client", "clients", "get");
  }
  return data ? rowToClient(data as ClientRowWithContacts) : null;
}

export async function getClientBySlug(slug: string): Promise<Client | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    throw new RepoError("Impossible de charger le client", "clients", "getBySlug");
  }
  return data ? rowToClient(data as ClientRowWithContacts) : null;
}

export async function createClient(
  payload: Omit<Client, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Client> {
  const supabase = createSupabaseClient();

  const insert: ClientInsert = {
    company_name: payload.companyName,
    slug: toSlug(payload.companyName),
    legal_form: payload.legalForm,
    siret: payload.siret,
    vat_number: payload.vatNumber ?? null,
    sector: payload.sector,
    headcount: payload.headcount ?? null,
    address_street: payload.address.street,
    address_postal_code: payload.address.postalCode,
    address_city: payload.address.city,
    address_country: payload.address.country,
    status: payload.status,
    contract_start_date: payload.contractStartDate || null,
    contract_end_date: payload.contractEndDate ?? null,
    internal_notes: payload.internalNotes,
  };

  const { data: created, error } = await supabase
    .from("clients")
    .insert(insert)
    .select("id")
    .single();
  if (error || !created) {
    throw new RepoError("Impossible de creer le client", "clients", "create");
  }

  if (payload.contacts.length > 0) {
    const contactRows: ClientContactInsert[] = payload.contacts.map((c) => ({
      client_id: created.id,
      first_name: c.firstName,
      last_name: c.lastName,
      role: c.role,
      email: c.email || null,
      phone: c.phone || null,
      is_primary: c.isPrimary,
    }));
    const { error: contactError } = await supabase
      .from("client_contacts")
      .insert(contactRows);
    if (contactError) {
      throw new RepoError("Impossible de creer le client", "clients", "create");
    }
  }

  const client = await getClientById(created.id);
  if (!client) {
    throw new RepoError("Impossible de creer le client", "clients", "create");
  }
  return client;
}

export async function updateClient(
  id: string,
  payload: Partial<Omit<Client, "id" | "slug" | "createdAt">>
): Promise<Client | null> {
  const supabase = createSupabaseClient();

  const update: ClientUpdate = {};
  if (payload.companyName !== undefined) {
    update.company_name = payload.companyName;
    update.slug = toSlug(payload.companyName);
  }
  if (payload.legalForm !== undefined) update.legal_form = payload.legalForm;
  if (payload.siret !== undefined) update.siret = payload.siret;
  if (payload.vatNumber !== undefined) update.vat_number = payload.vatNumber ?? null;
  if (payload.sector !== undefined) update.sector = payload.sector;
  if (payload.headcount !== undefined) update.headcount = payload.headcount ?? null;
  if (payload.address !== undefined) {
    update.address_street = payload.address.street;
    update.address_postal_code = payload.address.postalCode;
    update.address_city = payload.address.city;
    update.address_country = payload.address.country;
  }
  if (payload.status !== undefined) update.status = payload.status;
  if (payload.contractStartDate !== undefined) {
    update.contract_start_date = payload.contractStartDate || null;
  }
  if (payload.contractEndDate !== undefined) {
    update.contract_end_date = payload.contractEndDate ?? null;
  }
  if (payload.internalNotes !== undefined) update.internal_notes = payload.internalNotes;
  update.updated_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from("clients")
    .update(update)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    throw new RepoError("Impossible de modifier le client", "clients", "update");
  }
  if (!updated) return null;

  // Synchronise les contacts si fournis (delete + re-insert ; ids uuid régénérés).
  if (payload.contacts !== undefined) {
    await supabase.from("client_contacts").delete().eq("client_id", id);
    if (payload.contacts.length > 0) {
      const contactRows: ClientContactInsert[] = payload.contacts.map((c) => ({
        client_id: id,
        first_name: c.firstName,
        last_name: c.lastName,
        role: c.role,
        email: c.email || null,
        phone: c.phone || null,
        is_primary: c.isPrimary,
      }));
      const { error: contactError } = await supabase
        .from("client_contacts")
        .insert(contactRows);
      if (contactError) {
        throw new RepoError("Impossible de modifier les contacts", "clients", "update");
      }
    }
  }

  return getClientById(updated.id);
}

export async function softArchiveClient(id: string): Promise<Client | null> {
  return updateClient(id, { status: "archived" });
}

export async function deleteClient(id: string): Promise<boolean> {
  const supabase = createSupabaseClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    throw new RepoError("Impossible de supprimer le client", "clients", "delete");
  }
  return true;
}
