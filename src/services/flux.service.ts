import { api } from "./api";

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/etats-financier`;
// Interface descriptive d'une ligne du Tableau des Flux de Trésorerie
export interface LigneFluxTresoDto {
  codeRubrique: string;
  intitule: string;
  niveau: number;
  montantN: number;
  montantN1: number;
  modeCalcul: 'COMPTES' | 'SOMME';
  cssClasse: string;
}

// Enveloppe globale de restitution réseau du TFT
export interface FluxTresorerieResponseDto {
  exerciceId: number;
  lignes: LigneFluxTresoDto[];
}

export const fluxTresorerieService = {
  /**
   * 📊 1. EXTRACTION DES DONNÉES DU TABLEAU DES FLUX
   * Alimente la grille de visualisation écran pleine largeur.
   */
  extraireFlux: async (exerciceId: number, dateFin: string): Promise<FluxTresorerieResponseDto> => {
    const res = await api.get<FluxTresorerieResponseDto>(`${API_BASE}/flux-tresorerie/${exerciceId}`, {
      params: { dateFin }
    });
    return res.data;
  },

  /**
   * 📑 2. TÉLÉCHARGEMENT DU FICHIER EXCEL (APACHE POI)
   * Récupère le flux binaire Blob pour déclencher un téléchargement immédiat.
   */
  telechargerExcel: async (exerciceId: number, dateFin: string): Promise<Blob> => {
    const res = await api.get(`${API_BASE}/flux-tresorerie/${exerciceId}/excel`, {
      params: { dateFin },
      responseType: 'blob' // Obligatoire pour intercepter le flux d'octets sans corruption
    });
    return res.data;
  },

  /**
   * 📕 3. TÉLÉCHARGEMENT DU RAPPORT PDF COMPTABLE (OPENPDF)
   * Récupère le flux binaire Blob d'impression réglementaire.
   */
  telechargerPDF: async (exerciceId: number, dateFin: string): Promise<Blob> => {
    const res = await api.get(`${API_BASE}/flux-tresorerie/${exerciceId}/pdf`, {
      params: { dateFin },
      responseType: 'blob'
    });
    return res.data;
  }
};
