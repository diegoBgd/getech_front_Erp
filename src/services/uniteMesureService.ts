import { api } from '@/services/api';
import type { UniteMesure, UniteMesureFormValues } from '@/types';

const UNITES_MESURE_BASE = '/product-service/product-app/unites-mesure'; // ⚠️ À confirmer

function unwrapList(payload: unknown): UniteMesure[] {
  if (Array.isArray(payload)) return payload as UniteMesure[];
  const obj = payload as { data?: unknown; content?: unknown };
  if (Array.isArray(obj?.data)) return obj.data as UniteMesure[];
  if (Array.isArray(obj?.content)) return obj.content as UniteMesure[];
  console.warn('Forme de réponse inattendue pour la liste des unités de mesure:', payload);
  return [];
}
 
function unwrapItem(payload: unknown): UniteMesure {
  const obj = payload as { data?: UniteMesure };
  return (obj?.data ?? payload) as UniteMesure;
}

export const uniteMesureService = {
  async getAll(): Promise<UniteMesure[]> {
    const response = await api.get(`${UNITES_MESURE_BASE}/all`);
    return unwrapList(response.data);
  },
  async create(values: UniteMesureFormValues): Promise<UniteMesure> {
    const response = await api.post(`${UNITES_MESURE_BASE}/create`, values);
    return unwrapItem(response.data);
  },
  async update(id: number, values: UniteMesureFormValues): Promise<UniteMesure> {
    const response = await api.put(`${UNITES_MESURE_BASE}/update/${id}`, values);
    return unwrapItem(response.data);
  },
  async remove(id: number): Promise<void> {
    await api.delete(`${UNITES_MESURE_BASE}/delete/${id}`);
  },
};