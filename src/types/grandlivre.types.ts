export interface LigneGrandLivre {
  datePiece: string;
  numeroPiece: string;
  reference: string | null;
  libelleLigne: string;
  debit: number;
  credit: number;
  codeJournal: string;
}

export interface GrandLivreCompteBloc {
  codeCompte: string;
  intituleCompte: string;
  soldeInitialDebiteur: number;
  soldeInitialCrediteur: number;
  ecritures: LigneGrandLivre[];
  soldeFinalDebiteur: number;
  soldeFinalCrediteur: number;
}

export interface GrandLivreParams {
  dateDebut?: string;
  dateFin?: string;
  compteDebut?: string;
  compteFin?: string;
}
