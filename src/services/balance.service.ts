import { api } from "./api";

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/balance`;
// Interface alignée avec les critères de recherche et le format des colonnes
export interface BalanceParams {
  dateDebut?: string;
  dateFin?: string;
  typeBalance: string;
  centralisee: boolean;
}

export const balanceService = {
  // 1. Récupération des lignes de données pour la grille (Écran Frontend)
   getBalance: async (exerciceId: number, params: BalanceParams) => {
    const res = await api.get(`${API_BASE}/${exerciceId}`, { params });
    return res.data;
  },

  // 2. Téléchargement du fichier Excel binaire (Flux Apache POI)
  downloadExcel: async (exerciceId: number, params: BalanceParams): Promise<Blob> => {
    const res = await api.get(`${API_BASE}/${exerciceId}/export/excel`, {
      params,
      responseType: 'blob' // Impératif pour récupérer le flux binaire Blob
    });
    console.log("========"+res.data);
    return res.data;
  },

  // 3. Téléchargement du rapport PDF binaire (Flux OpenPDF)
  downloadPDF: async (exerciceId: number, params: BalanceParams): Promise<Blob> => {
    const res = await api.get(`${API_BASE}/${exerciceId}/export/pdf`, {
      params,
      responseType: 'blob'
    });
    return res.data;
  }
};
