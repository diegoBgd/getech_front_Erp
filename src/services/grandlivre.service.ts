import type { GrandLivreCompteBloc, GrandLivreParams } from '@/types/grandlivre.types';
import axios from 'axios';


const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/grand-livre`;

export const grandLivreService = {
  /**
   * Extrait les blocs de comptes du Grand Livre avec calcul des reports initiaux
   * @param exerciceId Identifiant de l'exercice comptable cible
   * @param params Objet contenant les dates et plages de comptes optionnelles
   */
  getGrandLivre: async (exerciceId: number, params: GrandLivreParams): Promise<GrandLivreCompteBloc[]> => {
    const response = await axios.get<GrandLivreCompteBloc[]>(`${API_BASE}/${exerciceId}`, { params });
    return response.data;
  },
   downloadExcel: async (exerciceId: number, params: GrandLivreParams): Promise<Blob> => {
    const res = await axios.get(`${API_BASE}/${exerciceId}/export/excel`, { params, responseType: 'blob' });
    return res.data;
  },

  downloadPDF: async (exerciceId: number, params: GrandLivreParams): Promise<Blob> => {
    const res = await axios.get(`${API_BASE}/${exerciceId}/export/pdf`, { params, responseType: 'blob' });
    return res.data;
  }
};
