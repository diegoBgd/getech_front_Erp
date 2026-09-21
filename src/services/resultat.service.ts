import { api } from "./api";



const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/etats-synthese`;


export interface LigneResultatDto {
  codeRubrique: string;
  intitule: string;
  niveau: number;
  montantN: number;
  montantN1: number;
}

export interface ResultatResponseDto {
  charges: LigneResultatDto[];
  produits: LigneResultatDto[];
}

export const resultatService = {
  extraireCompteResultat: async (exerciceId: number, dateFin: string): Promise<ResultatResponseDto> => {
    const response = await api.get<ResultatResponseDto>( `${API_BASE}/resultat/${exerciceId}`, {
      params: { dateFin }
    });
    return response.data;
  }
};
