import type { PieceComptableSaisie } from '@/types';
import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/erp/compta/ecritures';

export const ecritureService = {
  // Enregistrer une pièce comptable complète (En-tête + Lignes)
  enregistrerPiece: async (data: PieceComptableSaisie): Promise<any> => {
    const response = await axios.post(`${API_BASE}/saisie`, data);
    return response.data;
  },

  // Récupérer la liste des exercices pour le sélecteur
  getExercices: async (): Promise<any[]> => {
    const response = await axios.get(`${API_BASE}/exercices`);
    return response.data;
  },

  // Récupérer les journaux pour le sélecteur
  getJournaux: async (): Promise<any[]> => {
    const response = await axios.get(`${API_BASE}/journaux`);
    return response.data;
  },

  // Récupérer les comptes de détail pour la complétion des lignes
  getComptesDetail: async (): Promise<any[]> => {
    const response = await axios.get(`${API_BASE}/comptes`);
    // On ne garde que les comptes de détail (non collectifs) pour la saisie directe
    return response.data.filter((c: any) => !c.isCollectif);
  }
};
