
export type StatutExercice = 'OUVERT' | 'CLOTURE';

export interface Exercice {
  id: number;
  code: string; // 💡 Ajout du champ code
  libelle: string;
  dateDebut: string;
  dateFin: string;
  statut: StatutExercice;
}

export type ExerciceFormValues = Pick<
  Exercice,
  'code' | 'libelle' | 'dateDebut' | 'dateFin' // 💡 Ajout dans les valeurs du formulaire
>;
