import { api } from '@/services/api';
import type { Conditionnement, ConditionnementFormValues } from '@/types';

/**
 * Service "Conditionnement".
 *
 * ⚠️ Les chemins ci-dessous suivent la même convention que `categoryService.ts`
 * et `uniteMesureService.ts` (`/all`, `/create`, `/update/{id}`, `/delete/{id}`)
 * par cohérence, mais n'ont PAS été confirmés avec le backend réel.
 * À AJUSTER dès que les vrais endpoints du service "Conditionnement" sont connus.
 */
const CONDITIONNEMENTS_BASE = '/product-service/product-app/conditionnements';

/** Même logique défensive que categoryService : gère liste brute, { data } ou { content } (pagination Spring Data). */
function unwrapList(payload: unknown): Conditionnement[] {
  if (Array.isArray(payload)) return payload as Conditionnement[];
  const obj = payload as { data?: unknown; content?: unknown };
  if (Array.isArray(obj?.data)) return obj.data as Conditionnement[];
  if (Array.isArray(obj?.content)) return obj.content as Conditionnement[];
  console.warn('Forme de réponse inattendue pour la liste des conditionnements:', payload);
  return [];
}

function unwrapItem(payload: unknown): Conditionnement {
  const obj = payload as { data?: Conditionnement };
  return (obj?.data ?? payload) as Conditionnement;
}

export const conditionnementService = {
  async getAll(): Promise<Conditionnement[]> {
    const response = await api.get(`${CONDITIONNEMENTS_BASE}/all`);
    return unwrapList(response.data);
  },

  async create(values: ConditionnementFormValues): Promise<Conditionnement> {
    const response = await api.post(`${CONDITIONNEMENTS_BASE}/create`, values);
    return unwrapItem(response.data);
  },

  // TODO: confirmer le endpoint réel de modification (méthode + chemin).
  async update(id: number, values: ConditionnementFormValues): Promise<Conditionnement> {
    const response = await api.put(`${CONDITIONNEMENTS_BASE}/update/${id}`, values);
    return unwrapItem(response.data);
  },

  // TODO: confirmer le endpoint réel de suppression (méthode + chemin).
  async remove(id: number): Promise<void> {
    await api.delete(`${CONDITIONNEMENTS_BASE}/delete/${id}`);
  },
};