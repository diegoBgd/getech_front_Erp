import type { Exercice, ExerciceFormValues } from '@/types/exercice.types';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/exercices`;

export const exerciceService = {
  getAll: async (): Promise<Exercice[]> => {
    const res = await axios.get<Exercice[]>(API_URL);
    return res.data;
  },
  create: async (data: ExerciceFormValues): Promise<Exercice> => {
    const res = await axios.post<Exercice>(API_URL, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
}
};
