export interface ExerciceComptableRefDto {
  id: number;
  code: string;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  statut: 'OUVERT' | 'CLOTURE' | 'PROVISOIRE';
}

export interface LigneEcritureDto {
  id?: number;
  codeCompte: string;       
  intituleCompte?: string;  
  libelleLigne: string;     
  debit: number;            
  credit: number;            
}

export interface EcritureComptableDto {
  id?: number;
  numeroPiece: string;      
  datePiece: string;        
  libelleGeneral: string;   
  codeJournal: string;      
  exerciceId: number;
  exerciceRef?: ExerciceComptableRefDto;
  lignes: LigneEcritureDto[];
}
