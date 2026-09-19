import axios from 'axios';

export interface RubriqueFinanciere {
  id?: number;
  code: string;
  intitule: string;
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'; // 💡 Type élargi
  nature: 'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE';
  modeCalcul: 'COMPTES' | 'SOMME';
  plageComptesPrincipal?: string;
  plageComptesCorrectif?: string;
  sensSoldeAdmis?: 'TOUS' | 'DEBITEUR' | 'CREDITEUR';
  parentId?: number | null;
  ordre: number;
}

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/efi`;

export const rubriqueService = {
  // 💡 MIGRATION : Signature corrigée pour accepter la valeur FLUX_TRESO
  getParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'): Promise<RubriqueFinanciere[]> => {
    const res = await axios.get(`${API_BASE}/${typeEtat}`);
    return res.data;
  },

  save: async (rubrique: RubriqueFinanciere): Promise<RubriqueFinanciere> => {
    const res = await axios.post(`${API_BASE}`, rubrique);
    return res.data;
  },

  // 💡 MIGRATION : Signature corrigée également pour la liste des pivots parents
  getToutesParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'): Promise<RubriqueFinanciere[]> => {
    const res = await axios.get(`${API_BASE}/${typeEtat}/all`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  }
};
