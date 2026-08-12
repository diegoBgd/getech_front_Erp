import React, { useState } from 'react';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { GrandLivreParams } from '@/types/grandlivre.types';


interface GrandLivreFormProps {
  exercices: any[];
  comptes: any[];
  loading: boolean;
  onSubmit: (idExercice: number, params: GrandLivreParams) => void;
}

export const GrandLivreForm: React.FC<GrandLivreFormProps> = ({
  exercices, comptes, loading, onSubmit
}) => {
  const [idExercice, setIdExercice] = useState<number | null>(null);
  const [params, setParams] = useState<GrandLivreParams>({
    dateDebut: '', dateFin: '', compteDebut: '', compteFin: ''
  });

  // À ajuster dans la méthode handleSubmit de votre GrandLivreForm.tsx :

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (idExercice) {
    // Nettoie les chaînes pour envoyer de vrais champs non définis s'ils sont vides
    const cleanedParams: GrandLivreParams = {
      dateDebut: params.dateDebut || undefined,
      dateFin: params.dateFin || undefined,
      compteDebut: params.compteDebut || undefined,
      compteFin: params.compteFin || undefined,
    };
    onSubmit(idExercice, cleanedParams);
  }
};


  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-navy-50/30 dark:bg-navy-950/20 rounded-lg border border-navy-100 dark:border-navy-800">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Exercice *</label>
        <Select value={idExercice} options={exercices} onChange={(e) => setIdExercice(e.value)} placeholder="Choisir..." required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Du (Date)</label>
        <Input type="date" value={params.dateDebut} onChange={(e) => setParams({ ...params, dateDebut: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Au (Date)</label>
        <Input type="date" value={params.dateFin} onChange={(e) => setParams({ ...params, dateFin: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Compte Début</label>
        <Select value={params.compteDebut} options={comptes} onChange={(e) => setParams({ ...params, compteDebut: e.value })} placeholder="Du n°..." filter />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Compte Fin</label>
        <Select value={params.compteFin} options={comptes} onChange={(e) => setParams({ ...params, compteFin: e.value })} placeholder="Au n°..." filter />
      </div>
      <div className="col-span-1 md:col-span-5 flex justify-end mt-1">
        <Button type="submit" variant="default" size="sm" disabled={loading || !idExercice}>
          {loading ? 'Calcul de l\'état...' : 'Afficher le Grand Livre'}
        </Button>
      </div>
    </form>
  );
};
