
import type { EcritureComptableDto } from '@/types';
import { api } from './api';



const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/erp/compta/ecritures';

export const ecritureService = {
  // Enregistrer une pièce comptable complète (En-tête + Lignes)
  enregistrerPiece: async (data: EcritureComptableDto): Promise<any> => {
   
    const response = await api.post(`${API_BASE}/saisie`, data);
    return response.data;
  },

  // Récupérer la liste des exercices pour le sélecteur
  getExercices: async (): Promise<any[]> => {
    const response = await api.get(`${API_BASE}/exercices`);
    return response.data;
  },

  // Récupérer les journaux pour le sélecteur
  getJournaux: async (): Promise<any[]> => {
    const response = await api.get(`${API_BASE}/journaux`);
    return response.data;
  },

  // Récupérer les comptes de détail pour la complétion des lignes
  getComptesDetail: async (): Promise<any[]> => {
    const response = await api.get(`${API_BASE}/comptes`);
    // On ne garde que les comptes de détail (non collectifs) pour la saisie directe
    return response.data.filter((c: any) => !c.isCollectif);
  },
    // Récupérer toutes les pièces (pour alimenter le tableau de l'historique)
  getAllPieces: async (): Promise<any[]> => {
    const response = await api.get(`${API_BASE}/all`);
    return response.data;
  },

  // Récupérer le détail complet d'une pièce (en-tête + lignes) pour l'afficher
  getPieceDetails: async (id: number): Promise<any> => {
    const response = await api.get(`${API_BASE}/saisie/${id}`);
    return response.data;
  },
  updatePiece: async (id: number, data: EcritureComptableDto): Promise<any> => {
    const response = await api.put(`${API_BASE}/update/${id}`, data);
    return response.data;
  },

  deletePiece: async (id: number): Promise<void> => {
    await api.delete(`${API_BASE}/delete/${id}`);
  },
  obtenirSoldeCompteFlash: async (exerciceId: number, codeCompte: string): Promise<number> => {
    const res = await api.get<number>(`${API_BASE}/solde-actuel/${exerciceId}`, {
      params: { codeCompte }
    });
    return res.data;
  },
rechercherPieces: async (
    exerciceId: number,
    codeJournal?: string,
    dateDebut?: string,
    dateFin?: string
  ): Promise<EcritureComptableDto[]> => {
    const response = await api.get<EcritureComptableDto[]>(`${API_BASE}/recherche/${exerciceId}`, {
      params: { codeJournal, dateDebut, dateFin }
    });
    return response.data;
  },
};
