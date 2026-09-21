import type { Journal, JournalFormValues } from '@/types';
import { api } from './api';



const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/journaux`;

export const journalService = {
  // Récupérer tous les journaux du système
  getAllJournaux: async (): Promise<Journal[]> => {
    const response = await api.get<Journal[]>(API_URL);
    return response.data;
  },

  // Créer un nouveau journal
  createJournal: async (journalData: JournalFormValues): Promise<Journal> => {
    const formattedData = {
      ...journalData,
      code: journalData.code.toUpperCase().trim()
    };
    const response = await api.post<Journal>(API_URL, formattedData);
    return response.data;
  },
  updateJournal: async (id: number, data: JournalFormValues): Promise<Journal> => {
    const response = await api.put<Journal>(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteJournal: async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  }
};
