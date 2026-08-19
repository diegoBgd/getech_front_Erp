import type { ParametreOD } from '@/types';
import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/parametres`;

export const parametreService = {
  // Récupérer la configuration courante ou les valeurs par défaut
  getParametres: async (): Promise<ParametreOD> => {
    const response = await axios.get<ParametreOD>(API_URL);
    return response.data;
  },

  // Enregistrer ou mettre à jour la configuration unique
  enregistrerParametres: async (data: ParametreOD): Promise<ParametreOD> => {
    const response = await axios.post<ParametreOD>(API_URL, data);
    return response.data;
  }
};
