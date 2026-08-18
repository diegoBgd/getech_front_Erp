import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/balance`;

// Interface alignée avec les critères de recherche et le format des colonnes
export interface BalanceParams {
  dateDebut?: string;
  dateFin?: string;
  typeBalance: string;
  centralisee: boolean; // 💡 AJOUT
}


export const balanceService = {
    // 1. Récupération des lignes de données pour la grille
    getBalance: async (exerciceId: number, params: BalanceParams) => {
        const res = await axios.get(`${API_BASE}/${exerciceId}`, { params });
        return res.data;
    },

    // 2. Téléchargement du fichier Excel binaire
    downloadExcel: async (exerciceId: number, params: BalanceParams): Promise<Blob> => {
        const res = await axios.get(`${API_BASE}/${exerciceId}/export/excel`, {
            params,
            responseType: 'blob' // Impératif pour récupérer le flux de données Apache POI
        });
        return res.data;
    },

    // 3. Téléchargement du rapport PDF binaire
    downloadPDF: async (exerciceId: number, params: BalanceParams): Promise<Blob> => {
        const res = await axios.get(`${API_BASE}/${exerciceId}/export/pdf`, {
            params,
            responseType: 'blob' // Impératif pour récupérer le flux OpenPDF
        });
        return res.data;
    }
};
