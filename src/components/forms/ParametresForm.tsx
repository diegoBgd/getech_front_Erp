import React, { useState, useEffect } from 'react';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Divider } from 'primereact/divider';
import type { ParametreOD } from '@/types';


interface ParametresFormProps {
  journaux: any[];
  comptes: any[];
  loading: boolean;
  initialValues: ParametreOD;
  onSubmit: (values: ParametreOD) => void;
}

export const ParametresForm: React.FC<ParametresFormProps> = ({
  journaux, comptes, loading, initialValues, onSubmit
}) => {
  const [formData, setFormData] = useState<ParametreOD>(initialValues);

  useEffect(() => {
    if (initialValues) setFormData(initialValues);
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-accent-600 mb-3">Journaux par défaut</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-navy-700">Journal des À-nouveaux *</label>
            <Select 
              value={formData.journalAN} options={journaux} filter
              onChange={(e) => setFormData({ ...formData, journalAN: e.value })} required 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-navy-700">Journal des O.D (Clôture) *</label>
            <Select 
              value={formData.journalOD} options={journaux} filter
              onChange={(e) => setFormData({ ...formData, journalOD: e.value })} required 
            />
          </div>
        </div>
      </div>

      <Divider className="border-navy-50 m-0" />

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-accent-600 mb-3">Comptes de liquidation du résultat</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-navy-700">Compte de Résultat Bénéficiaire</label>
              <Select 
                value={formData.compteRs} options={comptes} filter
                onChange={(e) => setFormData({ ...formData, compteRs: e.value })} 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-navy-700">Compte de Résultat Déficitaire</label>
              <Select 
                value={formData.compteAND} options={comptes} filter
                onChange={(e) => setFormData({ ...formData, compteAND: e.value })} 
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-navy-700">Compte d'Attente de Régularisation</label>
            <Select 
              value={formData.compteANC} options={comptes} filter
              onChange={(e) => setFormData({ ...formData, compteANC: e.value })} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-navy-100">
        <Button type="submit" variant="default" size="sm" disabled={loading}>
          <i className="pi pi-save mr-2 text-xs"></i>
          {loading ? 'Enregistrement encours...' : 'Enregistrer'}
          
        </Button>
      </div>
    </form>
  );
};
