import type { ParametreOD } from '@/types';
import { api } from './api';



const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/parametres`;

export const parametreService = {
  // Récupérer la configuration courante ou les valeurs par défaut
  getParametres: async (): Promise<ParametreOD> => {
    const response = await api.get<ParametreOD>(API_URL);
    return response.data;
  },

  // Enregistrer ou mettre à jour la configuration unique
  enregistrerParametres: async (data: ParametreOD): Promise<ParametreOD> => {
    const response = await api.post<ParametreOD>(API_URL, data);
    return response.data;
  }
};
