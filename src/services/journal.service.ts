import type { Journal, JournalFormValues } from '@/types';
import axios from 'axios';


const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/journaux`;

export const journalService = {
  // Récupérer tous les journaux du système
  getAllJournaux: async (): Promise<Journal[]> => {
    const response = await axios.get<Journal[]>(API_URL);
    return response.data;
  },

  // Créer un nouveau journal
  createJournal: async (journalData: JournalFormValues): Promise<Journal> => {
    const formattedData = {
      ...journalData,
      code: journalData.code.toUpperCase().trim()
    };
    const response = await axios.post<Journal>(API_URL, formattedData);
    return response.data;
  }
};
