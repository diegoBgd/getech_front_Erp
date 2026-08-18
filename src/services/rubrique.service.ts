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
  parent?: RubriqueFinanciere | null;
  enfants?: RubriqueFinanciere[];
}

export const rubriqueService = {
  getParEtat: async (typeEtat: 'BILAN' | 'COMPTE_RESULTAT'): Promise<RubriqueFinanciere[]> => {
    const res = await axios.get(`/api/finance/configuration/rubriques/etat/${typeEtat}`);
    return res.data;
  },

  save: async (rubrique: RubriqueFinanciere): Promise<RubriqueFinanciere> => {
    const res = await axios.post('/api/finance/configuration/rubriques', rubrique);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`/api/finance/configuration/rubriques/${id}`);
  }
};
