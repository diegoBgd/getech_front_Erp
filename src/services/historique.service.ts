import { api } from "./api";


const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/historique_comptes`;
export interface LigneHistoriqueCompteDto {
  datePiece: string;
  numeroPiece: string;
  codeJournal: string;
  libelleEcriture: string;
  debit: number;
  credit: number;
  soldeProgressif: number;
}

export const historiqueService = {
  getHistorique: async (
    exerciceId: number,
    codeCompte: string,
    dateDebut?: string,
    dateFin?: string
  ): Promise<LigneHistoriqueCompteDto[]> => {
    const response = await api.get<LigneHistoriqueCompteDto[]>(
      `${API_BASE}/${exerciceId}`, 
      { params: { codeCompte, dateDebut, dateFin } }
    );
    return response.data;
  },

  // 💡 AJOUT : Export Excel sous forme de Blob binaire
  exporterExcel: async (
    exerciceId: number,
    codeCompte: string,
    dateDebut?: string,
    dateFin?: string
  ): Promise<Blob> => {
    const response = await api.get(
      `${API_BASE}/${exerciceId}/export/excel`,
      {
        params: { codeCompte, dateDebut, dateFin },
        responseType: 'blob'
      }
    );
    return response.data;
  },

  // 💡 AJOUT : Export PDF sous forme de Blob binaire
  exporterPdf: async (
    exerciceId: number,
    codeCompte: string,
    dateDebut?: string,
    dateFin?: string
  ): Promise<Blob> => {
    const response = await api.get(
      `${API_BASE}/${exerciceId}/export/pdf`,
      {
        params: { codeCompte, dateDebut, dateFin },
        responseType: 'blob'
      }
    );
    return response.data;
  }
};
