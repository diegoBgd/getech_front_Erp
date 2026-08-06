import type { Compte, CompteFormValues } from '@/types';
import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/plancomptable`;

export const compteService = {
  // Récupérer tout le plan comptable
  getAllComptes: async (): Promise<Compte[]> => {
    const response = await axios.get<Compte[]>(API_URL);
    return response.data;
  },

  // Créer un nouveau compte comptable (L'algorithme gère le parent automatiquement via le code)
  createCompte: async (compteData: CompteFormValues): Promise<Compte> => {
    const response = await axios.post<Compte>(API_URL, compteData);
    return response.data;
  },
  // Mettre à jour un compte existant
  updateCompte: async (id: number, compteData: CompteFormValues): Promise<Compte> => {
    const response = await axios.put<Compte>(`${API_URL}/${id}`, compteData);
    return response.data;
  },

  // Supprimer un compte par son identifiant technique
  deleteCompte: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};