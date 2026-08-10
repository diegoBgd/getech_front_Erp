export interface LigneEcritureSaisie {
  codeCompte: string;
  libelle: string;
  debit: number;
  credit: number;
}

export interface PieceComptableSaisie {
  codeJournal: string;
  idExercice: number;
  reference: string;
  datePiece: string; // Format YYYY-MM-DD
  lignes: LigneEcritureSaisie[];
}
