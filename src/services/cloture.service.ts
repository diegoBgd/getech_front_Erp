import { api } from './api';
const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/clotures`;
export interface LigneSimulation {
  codeCompte: string;
  intituleCompte: string;
  libelleLigne: string;
  debit: number;
  credit: number;
}

export interface ClotureSimulation {
  totalProduits: number;
  totalCharges: number;
  resultatNet: number;
  estBenefice: boolean;
  messageStatut: string;
  ecrituresPrevisionnelles: LigneSimulation[];
}
export const clotureService = {
  // 🔎 1. Simuler le résultat de l'exercice ou charger l'historique réel si clos
  simulerResultat: async (exerciceId: number): Promise<ClotureSimulation> => {
    const res = await api.get<ClotureSimulation>(`${API_BASE}/simuler/${exerciceId}`);
    return res.data;
  },

  // 🔒 2. Lancer la clôture ferme et définitive
  executerCloture: async (exerciceId: number): Promise<string> => {
    const res = await api.post<string>(`${API_BASE}/executer/${exerciceId}`);
    return res.data;
  },

  // 🔓 3. Annuler la clôture (Déclôturer) et purger l'écriture globale
  annulerCloture: async (exerciceId: number): Promise<string> => {
    const res = await api.delete<string>(`${API_BASE}/annuler/${exerciceId}`);
    return res.data;
  }
};
