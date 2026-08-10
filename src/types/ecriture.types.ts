export interface LigneEcritureSaisie {
  codeCompte: string;     // Fait écho à private String codeCompte;
  libelle: string;        // Fait écho à private String libelle;
  debit: number;          // Fait écho à private BigDecimal debit;
  credit: number;         // Fait écho à private BigDecimal credit;
}

export interface PieceComptableSaisie {
  codeJournal: string;    // Fait écho à private String codeJournal;
  idExercice: number;     // Fait écho à private Long idExercice; (Attention à la casse)
  reference: string;      // Fait écho à private String reference;
  datePiece: string;      // Fait écho à private LocalDate datePiece; (Format YYYY-MM-DD)
  lignes: LigneEcritureSaisie[]; // Fait écho à List<LigneEcritureSaisieDto>
}
