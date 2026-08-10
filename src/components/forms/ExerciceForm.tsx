import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { ExerciceFormValues } from '@/types/exercice.types';

interface ExerciceFormProps {
  onSubmit: (values: ExerciceFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ExerciceForm: React.FC<ExerciceFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState<ExerciceFormValues>({
    code: '',
    libelle: '',
    dateDebut: '',
    dateFin: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.trim() && formData.libelle.trim() && formData.dateDebut && formData.dateFin) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Code de l'exercice *</label>
        <Input 
          type="text" value={formData.code} 
          onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
          placeholder="Ex: 2026 ou EX26" maxLength={10} required disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Libellé *</label>
        <Input 
          type="text" value={formData.libelle} 
          onChange={(e) => setFormData({ ...formData, libelle: e.target.value })} 
          placeholder="Ex: Exercice 2026" required disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Date Début *</label>
        <Input 
          type="date" value={formData.dateDebut} 
          onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })} 
          required disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Date Fin *</label>
        <Input 
          type="date" value={formData.dateFin} 
          onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })} 
          required disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-navy-100 dark:border-navy-800">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" variant="default" size="sm" disabled={loading}>
          Ajouter
        </Button>
      </div>
    </form>
  );
};
