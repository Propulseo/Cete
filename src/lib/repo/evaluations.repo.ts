import { getItem, setItem } from "@/lib/store/storage";
import type { Evaluation } from "@/types/client";
import { RepoError } from "@/types/repo-error";
import seedData from "@/data/mocks/fr/evaluations.json";

const KEY = "cete_evaluations";
const SEED_VERSION_KEY = "cete_evaluations_v";
const SEED_VERSION = 2;

function seedIfEmpty(): void {
  if (
    !getItem<Evaluation[]>(KEY) ||
    getItem<number>(SEED_VERSION_KEY) !== SEED_VERSION
  ) {
    setItem(KEY, seedData.evaluations);
    setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
}

// TODO Supabase: supabase.from('evaluations').select('*').order('visit_date', { ascending: false })
export async function listEvaluations(): Promise<Evaluation[]> {
  try {
    seedIfEmpty();
    return getItem<Evaluation[]>(KEY) ?? [];
  } catch (error) {
    console.error("[evaluations.repo] listEvaluations failed:", error);
    throw new RepoError("Impossible de charger les evaluations", "evaluations", "list");
  }
}

// TODO Supabase: supabase.from('evaluations').select('*').eq('client_id', clientId)
export async function listEvaluationsByClientId(
  clientId: string
): Promise<Evaluation[]> {
  try {
    const evals = await listEvaluations();
    return evals.filter((e) => e.clientId === clientId);
  } catch (error) {
    console.error("[evaluations.repo] listByClientId failed:", error);
    throw new RepoError(
      "Impossible de charger les evaluations du client",
      "evaluations",
      "listByClientId"
    );
  }
}

// TODO Supabase: supabase.from('evaluations').select('*').eq('id', id).single()
export async function getEvaluation(id: string): Promise<Evaluation | null> {
  try {
    const evals = await listEvaluations();
    return evals.find((e) => e.id === id) ?? null;
  } catch (error) {
    console.error("[evaluations.repo] getEvaluation failed:", error);
    throw new RepoError("Impossible de charger l'evaluation", "evaluations", "get");
  }
}

// TODO Supabase: supabase.from('evaluations').insert(payload).select().single()
export async function createEvaluation(
  payload: Omit<Evaluation, "id" | "createdAt" | "updatedAt">
): Promise<Evaluation> {
  try {
    const evals = await listEvaluations();
    const now = new Date().toISOString();
    const newEval: Evaluation = {
      ...payload,
      id: `eval-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    evals.unshift(newEval);
    setItem(KEY, evals);
    return newEval;
  } catch (error) {
    console.error("[evaluations.repo] createEvaluation failed:", error);
    throw new RepoError("Impossible de creer l'evaluation", "evaluations", "create");
  }
}

// TODO Supabase: supabase.from('evaluations').update(payload).eq('id', id).select().single()
export async function updateEvaluation(
  id: string,
  payload: Partial<Omit<Evaluation, "id" | "createdAt">>
): Promise<Evaluation | null> {
  try {
    const evals = await listEvaluations();
    const idx = evals.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    evals[idx] = {
      ...evals[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    setItem(KEY, evals);
    return evals[idx];
  } catch (error) {
    console.error("[evaluations.repo] updateEvaluation failed:", error);
    throw new RepoError("Impossible de modifier l'evaluation", "evaluations", "update");
  }
}

// TODO Supabase: supabase.from('evaluations').delete().eq('id', id)
export async function deleteEvaluation(id: string): Promise<boolean> {
  try {
    const evals = await listEvaluations();
    const filtered = evals.filter((e) => e.id !== id);
    if (filtered.length === evals.length) return false;
    setItem(KEY, filtered);
    return true;
  } catch (error) {
    console.error("[evaluations.repo] deleteEvaluation failed:", error);
    throw new RepoError("Impossible de supprimer l'evaluation", "evaluations", "delete");
  }
}

export async function resetEvaluations(): Promise<void> {
  setItem(KEY, seedData.evaluations);
  setItem(SEED_VERSION_KEY, SEED_VERSION);
}
