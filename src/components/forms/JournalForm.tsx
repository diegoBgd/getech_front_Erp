import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import type { JournalFormValues, TypeJournal } from '@/types';

interface JournalFormProps {
  onSubmit: (values: JournalFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  initialValues?: JournalFormValues;
}

export const JournalForm: React.FC<JournalFormProps> = ({ onSubmit, onCancel, loading, initialValues }) => {
  const [formData, setFormData] = useState<JournalFormValues>({
    code: '',
    intitule: '',
    typeJournal: 'OPERATIONS_DIVERSES'
  });

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const typeJournalOptions = [
    { label: 'Achats', value: 'ACHATS' as TypeJournal },
    { label: 'Ventes', value: 'VENTES' as TypeJournal },
    { label: 'Trésorerie / Banque / Caisse', value: 'TRESORERIE' as TypeJournal },
    { label: 'Opérations Diverses (OD)', value: 'OPERATIONS_DIVERSES' as TypeJournal }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.trim() && formData.intitule.trim() && formData.typeJournal) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Code du Journal */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          Code Journal <span className="text-red-accent-500">*</span>
        </label>
        <Input 
          id="code" 
          value={formData.code} 
          onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
          placeholder="Ex: AC, BQ, VT, OD"
          maxLength={10}
          disabled={loading}
          required 
        />
      </div>

      {/* Intitulé / Libellé */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="intitule" className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          Intitulé du journal <span className="text-red-accent-500">*</span>
        </label>
        <Input 
          id="intitule" 
          value={formData.intitule} 
          onChange={(e) => setFormData({ ...formData, intitule: e.target.value })} 
          placeholder="Ex: Journal de la Banque Commerciale"
          disabled={loading}
          required 
        />
      </div>

      {/* Type de Journal via le Select unstyled unifié */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="typeJournal" className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          Type d'opérations <span className="text-red-accent-500">*</span>
        </label>
        <Select
          id="typeJournal"
          value={formData.typeJournal}
          options={typeJournalOptions}
          onChange={(e) => setFormData({ ...formData, typeJournal: e.value })}
          placeholder="Sélectionnez la catégorie de flux"
          disabled={loading}
        />
      </div>

      {/* Pied de page de la modale */}
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-navy-100 dark:border-navy-800">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onCancel} 
          disabled={loading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          variant="default" 
          size="sm"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : initialValues ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
