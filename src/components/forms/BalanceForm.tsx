import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface FormProps {
  exercices: any[];
  loading: boolean;
  onSubmit: (exerciceId: number, params: { dateDebut: string; dateFin: string }) => void;
}

export const BalanceForm: React.FC<FormProps> = ({ exercices, loading, onSubmit }) => {
  const [selectedEx, setSelectedEx] = useState<any>(null);
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEx) return;
    onSubmit(Number(selectedEx), { dateDebut, dateFin });
  };

  return (
    <form 
      onSubmit={handleFormSubmit} 
      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm"
    >
      {/* 💡 SÉLECTEUR AJUSTÉ : Typage d'événement lâche (any) pour absorber DropdownChangeEvent */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">
          Exercice Comptable
        </label>
        <Select
          value={selectedEx}
          options={exercices}
          onChange={(e: any) => setSelectedEx(e.value)}
          placeholder="Sélectionner un exercice"
          className="w-full text-xs"
        />
      </div>

      {/* Date Début via composant local Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">
          Date Début (Optionnel)
        </label>
        <Input
          type="date"
          value={dateDebut}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateDebut(e.target.value)}
          className="w-full text-xs"
        />
      </div>

      {/* Date Fin via composant local Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">
          Date Fin (Optionnel)
        </label>
        <Input
          type="date"
          value={dateFin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFin(e.target.value)}
          className="w-full text-xs"
                    placeholder="jj/mm/aaaa"
        />
      </div>

      {/* Bouton d'Action ERP local */}
      <Button 
        type="submit" 
        disabled={loading || !selectedEx} 
        variant="default"
        size="sm"
        className="w-full h-[38px] font-bold text-xs uppercase tracking-wider shadow-xs"
      >
        {loading ? (
          <>
            <i className="pi pi-spin pi-spinner mr-2 text-xs"></i>
            Calcul...
          </>
        ) : (
          <>
            <i className="pi pi-percentage mr-2 text-xs"></i>
            Générer la Balance
          </>
        )}
      </Button>
    </form>
  );
};
