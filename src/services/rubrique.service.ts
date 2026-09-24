
import { api } from "./api";


export interface RubriqueFinanciere {
  id?: number;
  code?: string;
  intitule: string;
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO';
  nature: 'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE';
  modeCalcul: 'COMPTES' | 'SOMME';
  plageComptesPrincipal?: string;
  plageComptesCorrectif?: string;
  sensSoldeAdmis?: 'TOUS' | 'DEBITEUR' | 'CREDITEUR'; // 💡 Parfaitement aligné sur le DTO Java
  parentId?: number | null;
  ordre: number;
}
const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/efi`;

export const rubriqueService = {
  getParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'): Promise<RubriqueFinanciere[]> => {
    // 💡 Remplacement de axios par api
    const res = await api.get<RubriqueFinanciere[]>(`${API_BASE}/${typeEtat}`);
    return res.data;
  },

  save: async (rubrique: RubriqueFinanciere): Promise<RubriqueFinanciere> => {
    const res = await api.post<RubriqueFinanciere>(`${API_BASE}`, rubrique);
    return res.data;
  },

  getToutesParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'): Promise<RubriqueFinanciere[]> => {
    const res = await api.get<RubriqueFinanciere[]>(`${API_BASE}/${typeEtat}/all`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  }
};
