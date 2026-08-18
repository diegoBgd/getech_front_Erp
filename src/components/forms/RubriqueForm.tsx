import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import type { RubriqueFinanciere } from '../../services/rubrique.service';


interface FormProps {
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT';
  onSuccess: () => void;
}

export const RubriqueForm: React.FC<FormProps> = ({ typeEtat, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [intitule, setIntitule] = useState('');
  const [nature, setNature] = useState<'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE'>('ACTIF');
  const [modeCalcul, setModeCalcul] = useState<'COMPTES' | 'SOMME'>('COMPTES');
  const [plagePrincipal, setPlagePrincipal] = useState('');
  const [plageCorrectif, setPlageCorrectif] = useState('');
  const [sensSolde, setSensSolde] = useState<'TOUS' | 'DEBITEUR' | 'CREDITEUR'>('TOUS');
  const [ordre, setOrdre] = useState('10');

  // Tableaux de configuration pour vos composants Select ERP
  const optionsNature = [
    { label: 'ACTIF', value: 'ACTIF' },
    { label: 'PASSIF', value: 'PASSIF' },
    { label: 'PRODUIT', value: 'PRODUIT' },
    { label: 'CHARGE', value: 'CHARGE' }
  ];

  const optionsMode = [
    { label: 'COMPTES (Interroger Balance)', value: 'COMPTES' },
    { label: 'SOMME (Pivot / Sous-Total)', value: 'SOMME' }
  ];

  const optionsSens = [
    { label: 'Tous Soldes Confondus', value: 'TOUS' },
    { label: 'Strictement Débiteur (> 0)', value: 'DEBITEUR' },
    { label: 'Strictement Créditeur (> 0)', value: 'CREDITEUR' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !intitule) return;

    setLoading(true);
    try {
      const payload: RubriqueFinanciere = {
        code,
        intitule,
        typeEtat,
        nature,
        modeCalcul,
        plageComptesPrincipal: modeCalcul === 'COMPTES' ? plagePrincipal : undefined,
        plageComptesCorrectif: modeCalcul === 'COMPTES' ? plageCorrectif : undefined,
        sensSoldeAdmis: sensSolde,
        ordre: Number(ordre)
      };

      const { rubriqueService } = await import('../../services/rubrique.service');
      await rubriqueService.save(payload);
      
      setCode('');
      setIntitule('');
      setPlagePrincipal('');
      setPlageCorrectif('');
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la règle", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm">
      
      {/* LIGNE 1 : ÉLÉMENTS IDENTIFICATEURS DE LA RUBRIQUE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Code Unique</label>
          <Input value={code} onChange={e => setCode(e.target.value)} placeholder="ex: COMPTE_12" required className="text-xs" />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Désignation / Intitulé Officiel</label>
          <Input value={intitule} onChange={e => setIntitule(e.target.value)} placeholder="ex: Immobilisations Corporelles" required className="text-xs" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Ordre d'affichage</label>
          <Input type="number" value={ordre} onChange={e => setOrdre(e.target.value)} required className="text-xs" />
        </div>
      </div>

      {/* LIGNE 2 : LOGIQUE DE CALCUL COMPTABLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Nature Financière</label>
          <Select 
            value={nature} 
            options={optionsNature}
            onChange={(e: any) => setNature(e.value)} 
            className="w-full text-xs font-bold uppercase" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Mode Opératoire</label>
          <Select 
            value={modeCalcul} 
            options={optionsMode}
            onChange={(e: any) => setModeCalcul(e.value)} 
            className="w-full text-xs font-bold uppercase" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Sens Solde Admis</label>
          <Select 
            value={sensSolde} 
            options={optionsSens}
            onChange={(e: any) => setSensSolde(e.value)} 
            className="w-full text-xs font-bold uppercase" 
            disabled={modeCalcul === 'SOMME'} 
          />
        </div>
      </div>

      {/* LIGNES OPTIONNELLES POUR LES PLAGES DE COMPTES */}
      {modeCalcul === 'COMPTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-navy-100 pt-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Comptes Principaux (Valeur Brute)</label>
            <Input value={plagePrincipal} onChange={e => setPlagePrincipal(e.target.value)} placeholder="ex: 21,22,24,!245" className="text-xs font-mono font-bold" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-rose-800 uppercase tracking-wider">Comptes Correctifs (Amortissements / Dépréciations)</label>
            <Input value={plageCorrectif} onChange={e => setPlageCorrectif(e.target.value)} placeholder="ex: 281,282,291" className="text-xs font-mono font-bold" />
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-navy-100 pt-3">
        <Button type="submit" disabled={loading} variant="default" size="sm" className="w-[200px] font-bold uppercase text-xs tracking-wider h-[38px]">
          {loading ? 'Enregistrement...' : 'Enregistrer la Règle'}
        </Button>
      </div>
    </form>
  );
};
