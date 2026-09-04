import React, { useState } from 'react';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { GrandLivreParams } from '@/types/grandlivre.types';

interface GrandLivreFormProps {
  comptes: any[];
  loading: boolean;
  onSubmit: (params: GrandLivreParams) => void;
}

export const GrandLivreForm: React.FC<GrandLivreFormProps> = ({
  comptes, loading, onSubmit
}) => {
  const [params, setParams] = useState<GrandLivreParams>({
    dateDebut: '', dateFin: '', compteDebut: '', compteFin: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedParams: GrandLivreParams = {
      dateDebut: params.dateDebut || undefined,
      dateFin: params.dateFin || undefined,
      compteDebut: params.compteDebut || undefined,
      compteFin: params.compteFin || undefined,
    };
    onSubmit(cleanedParams);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[10%_10%_35%_40%] gap-3 p-4 bg-navy-50/30 dark:bg-navy-950/20 rounded-lg border border-navy-100 dark:border-navy-800">
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
        <div className="flex gap-2">
          <Select value={params.compteFin} options={comptes} onChange={(e) => setParams({ ...params, compteFin: e.value })} placeholder="Au n°..." filter className="flex-1" />
          <Button type="submit" variant="default" size="sm" disabled={loading} className="h-[30px] shrink-0 font-bold  text-xs">
            Filtrer
          </Button>
        </div>
      </div>
    </form>
  );
};
