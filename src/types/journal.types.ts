export type TypeJournal = 'ACHATS' | 'VENTES' | 'TRESORERIE' | 'OPERATIONS_DIVERSES';

export interface Journal {
  id: number;
  code: string;
  intitule: string;
  typeJournal: TypeJournal;
  isActif: boolean;
}

/** Données requises pour le formulaire d'ajout (sans champs calculés). */
export type JournalFormValues = Pick<
  Journal,
  'code' | 'intitule' | 'typeJournal'
>;
