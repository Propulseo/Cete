import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests du repo notifications sans base : le client Supabase navigateur est mocké.
 * On vérifie surtout le mappage isRead et le caractère idempotent/robuste des
 * écritures de lecture.
 */

const state = vi.hoisted(() => ({
  rows: [] as unknown[],
  reads: [] as { notification_id: string }[],
  userId: undefined as string | undefined,
  upserts: [] as unknown[],
  inserts: [] as unknown[],
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: async () => ({
        data: { user: state.userId ? { id: state.userId } : null },
        error: null,
      }),
    },
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          limit: async () =>
            table === "notifications" ? { data: state.rows, error: null } : { data: [], error: null },
        }),
        eq: async () => ({ data: state.reads, error: null }),
      }),
      eq: async () => ({ data: table === "notifications" ? state.rows : [], error: null }),
      upsert: async (payload: unknown) => {
        state.upserts.push({ table, payload });
        return { error: null };
      },
      insert: async (payload: unknown) => {
        state.inserts.push({ table, payload });
        return { data: null, error: { message: "mock: pas de retour single" } };
      },
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  }),
}));

import {
  listNotificationsForCurrentUser,
  markAllAsRead,
  markAsRead,
  notifyClientsAssigned,
} from "./notifications.repo";

const row = (id: string) => ({
  id,
  type: "document",
  message: `message ${id}`,
  date: "2026-08-25T10:00:00Z",
  visibility: "assigned",
  assigned_client_ids: ["client-1"],
  created_at: "2026-08-25T09:00:00Z",
});

beforeEach(() => {
  state.rows = [row("n1"), row("n2")];
  state.reads = [{ notification_id: "n1" }];
  state.userId = "user-7";
  state.upserts = [];
  state.inserts = [];
});

describe("listNotificationsForCurrentUser", () => {
  it("calcule isRead à partir des lectures de l'utilisateur courant", async () => {
    const list = await listNotificationsForCurrentUser();
    expect(list).toHaveLength(2);
    expect(list.find((n) => n.id === "n1")?.isRead).toBe(true);
    expect(list.find((n) => n.id === "n2")?.isRead).toBe(false);
  });

  it("renvoie les notifications sans isRead quand aucune session", async () => {
    state.userId = undefined;
    const list = await listNotificationsForCurrentUser();
    expect(list).toHaveLength(2);
    expect(list[0]).not.toHaveProperty("isRead");
  });
});

describe("markAllAsRead", () => {
  it("ne marque que les non lues", async () => {
    await markAllAsRead();
    expect(state.upserts).toHaveLength(1);
    expect(state.upserts[0]).toMatchObject({
      payload: { notification_id: "n2", user_id: "user-7" },
    });
  });

  it("marquer une seule notification upsert la paire complète", async () => {
    await markAsRead("n2");
    expect(state.upserts[0]).toEqual({
      table: "notification_reads",
      payload: { notification_id: "n2", user_id: "user-7" },
    });
  });
});

describe("notifyClientsAssigned", () => {
  it("ne fait rien sans client visé", async () => {
    await notifyClientsAssigned({ message: "x", clientIds: [] });
    expect(state.inserts).toHaveLength(0);
  });

  it("avale un échec d'insertion sans casser la publication appelante", async () => {
    await expect(
      notifyClientsAssigned({ message: "doc publié", clientIds: ["client-1"] })
    ).resolves.toBeUndefined();
    expect(state.inserts).toHaveLength(1);
  });
});
