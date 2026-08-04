/**
 * Types liés au domaine "Unité de Mesure".
 */
export type TypeMesure = 'volume' | 'poids' | 'quantite' | 'longueur';

/** Libellés affichés en français pour chaque type de mesure. */
export const typeMesureLabels: Record<TypeMesure, string> = {
  volume: 'Volume',
  poids: 'Poids',
  quantite: 'Quantité',
  longueur: 'Longueur',
};

/** Options prêtes à l'emploi pour un <select> (formulaire, filtre...). */
export const typeMesureOptions: { value: TypeMesure; label: string }[] = (
  Object.keys(typeMesureLabels) as TypeMesure[]
).map((value) => ({ value, label: typeMesureLabels[value] }));

export interface UniteMesure {
  id: number;
  code: string;
  libelle: string;
  typeMesure: TypeMesure;
}

export type UniteMesureFormValues = Pick<UniteMesure, 'code' | 'libelle' | 'typeMesure'>;