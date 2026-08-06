import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from '../ui/button'; // Votre composant bouton personnalisé
import type { CompteFormValues } from '@/types';
import { Input } from '../ui/input';
import { Select } from '../ui/select';


interface CompteFormProps {
  onSubmit: (values: CompteFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  initialValues?: CompteFormValues; // Ajout de la propriété manquante
}

export const CompteForm: React.FC<CompteFormProps> = ({ onSubmit, onCancel, loading, initialValues }) => {
  const [formData, setFormData] = useState<CompteFormValues>({
    code: '',
    intitule: '',
    isCollectif: false
  });

  // Synchronisation de l'état local si des valeurs initiales sont fournies (cas de la modification)
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const typeOptions = [
    { label: 'Détail / Mouvement (Saisie)', value: false },
    { label: 'Collectif (Totalisateur)', value: true }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.trim() && formData.intitule.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Champ Code */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          Code <span className="text-red-accent-500">*</span>
        </label>
        <Input
        value={formData.code} 
        onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
        placeholder="Ex: 411" 
        required 
         disabled={loading}
      />

      </div>

      {/* Champ Intitulé */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="intitule" className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          Intitulé du compte <span className="text-red-accent-500">*</span>
        </label>
        <Input
          value={formData.intitule} 
          onChange={(e) => setFormData({ ...formData, intitule: e.target.value })} 
          placeholder="Ex: Client Dupont"
          disabled={loading}
          required 
        />
      </div>

      {/* Champ Structure (Dropdown comme sur le modèle) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="isCollectif" className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          Type de structure comptable <span className="text-red-accent-500">*</span>
        </label>
       <Select
        value={formData.isCollectif}
        options={typeOptions}
        onChange={(e) => setFormData({ ...formData, isCollectif: e.value })}
        placeholder="Sélectionnez une structure"
      />

      </div>

      {/* Barre d'actions du bas identique au modèle de votre image */}
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
          variant="default" // Utilise le style sombre bg-navy-700 de votre UI
          size="sm"
          disabled={loading}
         
        >
          {loading ? 'Chargement...' : initialValues ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
