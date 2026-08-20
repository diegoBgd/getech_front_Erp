export type StatutExercice = 'OUVERT' | 'CLOTURE';

export interface Exercice {
  id: number;
  code: string; 
  libelle: string;
  dateDebut: string;
  dateFin: string;
  statut: StatutExercice;
  // 💡 Propriétés optionnelles pour porter le chaînage N-1
  exercicePrecedentId?: number | null;
  exercicePrecedentLibelle?: string | null;
}

// 📝 Mise à jour des valeurs éditables par le formulaire
export type ExerciceFormValues = Pick<
  Exercice,
  'code' | 'libelle' | 'dateDebut' | 'dateFin' | 'exercicePrecedentId'
>;
