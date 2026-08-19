import axios from 'axios';

export interface RubriqueFinanciere {
  id?: number;
  code: string;
  intitule: string;
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT';
  nature: 'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE';
  modeCalcul: 'COMPTES' | 'SOMME';
  plageComptesPrincipal?: string;
  plageComptesCorrectif?: string;
  sensSoldeAdmis: 'TOUS' | 'DEBITEUR' | 'CREDITEUR';
  ordre: number;
  parentId?: number | null;   // 💡 ALIGNEMENT : Utilisation de l'ID direct à la place de l'objet imbriqué
  parentCode?: string | null;
}

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/efi`;
export const rubriqueService = {
  getParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT'): Promise<RubriqueFinanciere[]> => {
    const res = await axios.get(`${API_BASE}/${typeEtat}`);
    return res.data;
  },

  save: async (rubrique: RubriqueFinanciere): Promise<RubriqueFinanciere> => {
    const res = await axios.post(`${API_BASE}`, rubrique);
    return res.data;
  },
  // 💡 AJOUT DANS L'OBJET rubriqueService
  getToutesParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT'): Promise<RubriqueFinanciere[]> => {
    const res = await axios.get(`${API_BASE}/${typeEtat}/all`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/${id}`);
  }
};
