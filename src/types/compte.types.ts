export interface Compte {
  id: number;
  code: string;
  intitule: string;
  niveau: number;
  isCollectif: boolean;
  codeParent: string | null;
}

/** Données requises pour le formulaire d'ajout (aligné sur CompteDto du backend) */
export type CompteFormValues = Pick<
  Compte,
  'code' | 'intitule' | 'isCollectif'
>;