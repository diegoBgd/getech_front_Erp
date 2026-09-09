import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';

interface FormProps {
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT';
  onSuccess: () => void;
  initialValues: RubriqueFinanciere | null; // 💡 Reçoit la ligne à modifier
  onCancelEdit: () => void;                 // 💡 Action de désistement
}

export const RubriqueForm: React.FC<FormProps> = ({ typeEtat, onSuccess, initialValues, onCancelEdit }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [intitule, setIntitule] = useState('');
  const [nature, setNature] = useState<'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE'>('ACTIF');
  const [modeCalcul, setModeCalcul] = useState<'COMPTES' | 'SOMME'>('COMPTES');
  const [plagePrincipal, setPlagePrincipal] = useState('');
  const [plageCorrectif, setPlageCorrectif] = useState('');
  const [sensSolde, setSensSolde] = useState<'TOUS' | 'DEBITEUR' | 'CREDITEUR'>('TOUS');
  const [ordre, setOrdre] = useState('10');
  const [parentId, setParentId] = useState<number | null>(null);
  const [listeParentsPossibles, setListeParentsPossibles] = useState<{ label: string; value: number | null }[]>([]);

  const chargerRubriquesPivots = async () => {
    try {
      const data = await rubriqueService.getToutesParEtat(typeEtat);
      const options: { label: string; value: number | null }[] = [];
      if (data && Array.isArray(data)) {
        data.forEach(node => {
          // Évite de s'auto-sélectionner comme son propre parent (boucle infinie)
          if (node.id !== undefined && node.id !== null && node.id !== initialValues?.id) {
            options.push({
              label: `[${node.code}] ${node.intitule.toUpperCase()} (${node.modeCalcul})`,
              value: node.id
            });
          }
        });
      }
      setListeParentsPossibles([
        { label: 'AUCUN PARENT (RUBRIQUE RACINE / NIVEAU 0)', value: null }, 
        ...options
      ]);
    } catch (err) {
      console.error("Erreur pré-chargement parents", err);
    }
  };

  // 💡 EFFET COMMUN : Bascule du mode Création au mode Edition si initialValues change
  useEffect(() => {
    chargerRubriquesPivots();
    if (initialValues) {
      setCode(initialValues.code || '');
      setIntitule(initialValues.intitule || '');
      setNature(initialValues.nature || 'ACTIF');
      setModeCalcul(initialValues.modeCalcul || 'COMPTES');
      setPlagePrincipal(initialValues.plageComptesPrincipal || '');
      setPlageCorrectif(initialValues.plageComptesCorrectif || '');
      setSensSolde((initialValues.sensSoldeAdmis as any) || 'TOUS');
      setOrdre(String(initialValues.ordre || '10'));
      setParentId(initialValues.parentId || null);
    } else {
      setCode(''); setIntitule(''); setPlagePrincipal(''); setPlageCorrectif('');
      setNature('ACTIF'); setModeCalcul('COMPTES'); setSensSolde('TOUS'); setOrdre('10'); setParentId(null);
    }
  }, [initialValues, typeEtat]);

  const optionsNature = [
    { label: 'ACTIF (Bilan)', value: 'ACTIF' }, { label: 'PASSIF (Bilan)', value: 'PASSIF' },
    { label: 'PRODUIT (Résultat)', value: 'PRODUIT' }, { label: 'CHARGE (Résultat)', value: 'CHARGE' }
  ];

  const optionsMode = [
    { label: 'COMPTES (Interroger Balance)', value: 'COMPTES' }, { label: 'SOMME (Calculer sous-totaux)', value: 'SOMME' }
  ];

  const optionsSens = [
    { label: 'Tous Soldes Confondus', value: 'TOUS' }, { label: 'Strictement Débiteur (> 0)', value: 'DEBITEUR' }, { label: 'Strictement Créditeur (> 0)', value: 'CREDITEUR' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !intitule) return;

    setLoading(true);
    try {
      const payload: RubriqueFinanciere = {
        id: initialValues?.id, // 💡 IMPORTANT : Injecte l'ID s'il s'agit d'une modification
        code: code.trim().toUpperCase(),
        intitule: intitule.trim(),
        typeEtat,
        nature,
        modeCalcul,
        plageComptesPrincipal: modeCalcul === 'COMPTES' ? plagePrincipal.trim() : undefined,
        plageComptesCorrectif: modeCalcul === 'COMPTES' ? plageCorrectif.trim() : undefined,
        sensSoldeAdmis: modeCalcul === 'COMPTES' ? sensSolde : 'TOUS',
        ordre: Number(ordre),
        parentId: parentId
      };

      await rubriqueService.save(payload);
      onSuccess();
    } catch (err) {
      console.error("Erreur d'écriture", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 rounded-xl border shadow-sm transition-all duration-300 ${
      initialValues ? 'bg-sky-accent-50/20 border-sky-accent-200 dark:bg-navy-900/60 dark:border-sky-accent-900' : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800'
    }`}>
      
      {/* INDICATEUR CONTEXTUEL RE-RECONNAISSABLE */}
      {initialValues && (
        <div className="flex justify-between items-center bg-sky-accent-500/10 text-sky-accent-700 dark:text-sky-accent-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md">
          <span>⚠️ Mode Édition de Ligne actif : modification de [{initialValues.code}]</span>
          <button type="button" onClick={onCancelEdit} className="text-rose-600 hover:underline cursor-pointer lowercase font-bold">Annuler l'édition</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Code Ligne Unique</label>
          <Input value={code} onChange={e => setCode(e.target.value)} placeholder="ex: TOT_ACTIF_IMMOB" required className="text-xs font-mono font-bold" />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Désignation du Poste</label>
          <Input value={intitule} onChange={e => setIntitule(e.target.value)} placeholder="ex: Immobilisations Corporelles" required className="text-xs font-bold" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Rattacher au Parent</label>
          <Select value={parentId} options={listeParentsPossibles} onChange={(e: any) => setParentId(e.value)} placeholder="Sélectionner un parent" className="w-full text-xs font-medium" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Nature Comptable</label>
          <Select value={nature} options={optionsNature} onChange={(e: any) => setNature(e.value)} className="w-full text-xs" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Mode Opératoire</label>
          <Select value={modeCalcul} options={optionsMode} onChange={(e: any) => setModeCalcul(e.value)} className="w-full text-xs" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Sens Solde Admis</label>
          <Select value={sensSolde} options={optionsSens} onChange={(e: any) => setSensSolde(e.value)} className="w-full text-xs" disabled={modeCalcul === 'SOMME'} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 tracking-wider">Index Ordre d'affichage</label>
          <Input type="number" value={ordre} onChange={e => setOrdre(e.target.value)} required className="text-xs font-bold" />
        </div>
      </div>

      {modeCalcul === 'COMPTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-navy-100 dark:border-navy-800 pt-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">Comptes Principaux (Valeurs Brutes)</label>
            <Input value={plagePrincipal} onChange={e => setPlagePrincipal(e.target.value)} placeholder="Separer par virgules. ex: 21,22,24" required={modeCalcul === 'COMPTES'} className="text-xs font-mono font-bold tracking-wide" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-rose-700 dark:text-rose-400 tracking-wider">Comptes Correctifs (Amortissements)</label>
            <Input value={plageCorrectif} onChange={e => setPlageCorrectif(e.target.value)} placeholder="ex: 281,282,291" className="text-xs font-mono font-bold tracking-wide" />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-navy-100 dark:border-navy-800">
        {initialValues && (
          <Button type="button" variant="outline" size="sm" onClick={onCancelEdit} className="h-[30px] text-xs font-bold uppercase px-4 border-navy-200 text-navy-600">
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading} className={`w-[150px] h-[30px] font-bold  text-xs tracking-wider shadow-xs ${initialValues ? 'bg-sky-accent-600 hover:bg-sky-accent-700' : ''}`}>
          {loading ? <><i className="pi pi-spin pi-spinner mr-2" /> Enregister</> : initialValues ? <><i className="pi pi-save mr-2" /> Enregistrer </> : <><i className="pi pi-save mr-2" /> Enregistrer </>}
        </Button>
      </div>
    </form>
  );
};
