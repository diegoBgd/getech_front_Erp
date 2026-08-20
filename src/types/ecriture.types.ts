// ========================================================
//  REFERENCE DE L'EXERCICE COMPTABLE (LIÉ AUX ÉCRITURES)
// ========================================================
export interface ExerciceComptableRefDto {
  id: number;
  code: string;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  statut: 'OUVERT' | 'CLOTURE' | 'PROVISOIRE';
}

// ========================================================
//  STRUCTURE D'UNE LIGNE D'ÉCRITURE COMPTABLE (SQUELETTE)
// ========================================================
export interface LigneEcritureDto {
  id?: number;
  codeCompte: string;       // ex: "512000"
  intituleCompte?: string;  // Libellé étendu récupéré du Plan Comptable
  libelleLigne: string;     // Libellé de l'opération sur cette ligne
  debit: number;            // Montant Débit (0 si Crédit)
  credit: number;           // Montant Crédit (0 si Débit)
}

// ========================================================
//  ENVELOPPE GLOBALE DU PIECE / JOURNAL D'ÉCRITURES
// ========================================================
export interface EcritureComptableDto {
  id?: number;
  numeroPiece: string;      // Numéro séquentiel auto-généré ou saisi
  datePiece: string;        // Date de l'opération (YYYY-MM-DD)
  libelleGeneral: string;   // Description principale de la pièce
  codeJournal: string;      // ex: "HA" (Achats), "VT" (Ventes), "BQ" (Banque)
  
  //  Association stricte à l'exercice en cours de traitement
  exerciceId: number;
  exerciceRef?: ExerciceComptableRefDto;

  // Liste ordonnée des lignes formant la pièce comptable
  lignes: LigneEcritureDto[];
}

// ========================================================
// UTILITAIRE DE VALIDATION CLIENT (FRONTEND ONLY)
// ========================================================
export const ecritureUtils = {
  /**
   * Vérifie le principe fondamental de la partie double (Débit = Crédit)
   */
  estEquilibree: (ecriture: EcritureComptableDto): boolean => {
    if (!ecriture.lignes || ecriture.lignes.length === 0) return false;
    
    const totalDebit = ecriture.lignes.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = ecriture.lignes.reduce((sum, l) => sum + (l.credit || 0), 0);
    
    // Tolérance d'arrondi sur les flottants JavaScript
    return Math.abs(totalDebit - totalCredit) < 0.01;
  },

  /**
   * Valide que la date de la pièce s'inscrit bien dans les bornes de l'exercice
   */
  estDateValide: (datePiece: string, exercice: ExerciceComptableRefDto): boolean => {
    const pDate = new Date(datePiece);
    const start = new Date(exercice.dateDebut);
    const end = new Date(exercice.dateFin);
    
    return pDate >= start && pDate <= end;
  }
};
