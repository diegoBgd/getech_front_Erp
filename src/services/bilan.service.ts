import axios from 'axios';


const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/etats-synthese`;

//  1. STRUCTURE DE L'ACTIF (4 COLONNES DE MONTANTS)
export interface LigneActifDto {
  codeRubrique: string;
  intitule: string;
  brutN: number;
  amortissementN: number;
  netN: number;
  netN1: number;
  niveau: number; // Utile pour l'indentation graphique
}

//  2. STRUCTURE DU PASSIF (2 COLONNES DE MONTANTS)
export interface LigneSyntheseDto {
  codeRubrique: string;
  intitule: string;
  montantN: number;
  montantN1: number;
  niveau: number; // Utile pour l'indentation graphique
}

//  3. ENVELOPPE GLOBALE DU BILAN COMPLET
export interface BilanCompletResponseDto {
  actif: LigneActifDto[];
  passif: LigneSyntheseDto[];
}

//  4. SERVICE AXIOS ASSOCIE
export const bilanService = {
  
  extraireBilan: async (
    exerciceId: number, 
    dateFin: string
  ): Promise<BilanCompletResponseDto> => {
    
    const response = await axios.get<BilanCompletResponseDto>(
      `${API_BASE}/bilan/${exerciceId}`,
      {
        params: { dateFin } // Format attendu par Spring : 'YYYY-MM-DD'
      }
    );
    
    return response.data;
  }

};
