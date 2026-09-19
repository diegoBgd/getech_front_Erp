import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/etats-synthese`;

export interface LigneActifDto {
  codeRubrique: string;
  intitule: string;
  brutN: number;
  amortissementN: number;
  netN: number;
  netN1: number;
  niveau: number; 
}

export interface LignePassifDto {
  id?: number;
  code: string;
  intitule: string;
  modeCalcul: 'COMPTES' | 'SOMME';
  niveau?: number;
  parentId?: number | null;
  montantN: number;
  montantN1: number;
}

export interface LigneSyntheseDto {
  codeRubrique: string;
  intitule: string;
  montantN: number;
  montantN1: number;
  niveau: number; 
}

export interface BilanCompletResponseDto {
  exerciceId: number;
  actif: LigneActifDto[];
  passif: LigneSyntheseDto[];
}

export const bilanService = {
  extraireBilan: async (exerciceId: number, dateFin: string): Promise<BilanCompletResponseDto> => {
    const response = await axios.get<BilanCompletResponseDto>(`${API_BASE}/bilan/${exerciceId}`, {
      params: { dateFin }
    });
    return response.data;
  },

  // 💡 AJOUT : Fonctions d'exportation de production connectées au contrôleur des états de synthèse
  downloadExcel: async (exerciceId: number, dateFin: string): Promise<Blob> => {
    const response = await axios.get(`${API_BASE}/bilan/${exerciceId}/excel`, {
      params: { dateFin },
      responseType: 'blob'
    });
    return response.data;
  },

  downloadPDF: async (exerciceId: number, dateFin: string): Promise<Blob> => {
    const response = await axios.get(`${API_BASE}/bilan/${exerciceId}/pdf`, {
      params: { dateFin },
      responseType: 'blob'
    });
    return response.data;
  }
};
