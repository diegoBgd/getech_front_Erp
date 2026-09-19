import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select'; // 💡 Votre composant UI basé sur PrimeReact Dropdown
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';

interface FormProps {
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO';
  onSuccess: () => void;
  initialValues: RubriqueFinanciere | null;
  onCancelEdit: () => void;
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
      // 💡 APPEL DIRECT DE TOUTES LES LIGNES SANS FILTRE LIMITANT
      const data = await rubriqueService.getToutesParEtat(typeEtat);
      const options = (data && Array.isArray(data)) 
        ? data.filter(n => n.id !== initialValues?.id).map(n => ({ 
            label: `[${n.code}] ${n.intitule.toUpperCase()} (${n.modeCalcul})`, 
            value: n.id! 
          })) 
        : [];
      setListeParentsPossibles([{ label: 'AUCUN PARENT (NIVEAU 0)', value: null }, ...options]);
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => {
    chargerRubriquesPivots();
    if (initialValues) {
      setCode(initialValues.code || ''); setIntitule(initialValues.intitule || ''); setNature(initialValues.nature || 'ACTIF');
      setModeCalcul(initialValues.modeCalcul || 'COMPTES'); setPlagePrincipal(initialValues.plageComptesPrincipal || '');
      setPlageCorrectif(initialValues.plageComptesCorrectif || ''); setSensSolde((initialValues.sensSoldeAdmis as any) || 'TOUS');
      setOrdre(String(initialValues.ordre || '10')); setParentId(initialValues.parentId || null);
    } else {
      setCode(''); setIntitule(''); setPlagePrincipal(''); setPlageCorrectif(''); setOrdre('10'); setParentId(null); setModeCalcul('COMPTES'); setSensSolde('TOUS');
      setNature(typeEtat === 'COMPTE_RESULTAT' ? 'PRODUIT' : 'ACTIF');
    }
  }, [initialValues, typeEtat]);

  useEffect(() => {
    if (modeCalcul === 'SOMME') setSensSolde('TOUS');
  }, [modeCalcul]);

  const optionsNature = typeEtat === 'COMPTE_RESULTAT' ? [{ label: 'PRODUIT', value: 'PRODUIT' }, { label: 'CHARGE', value: 'CHARGE' }] : typeEtat === 'FLUX_TRESO' ? [{ label: 'FLUX ENTRANT', value: 'ACTIF' }, { label: 'FLUX SORTANT', value: 'PASSIF' }] : [{ label: 'ACTIF', value: 'ACTIF' }, { label: 'PASSIF', value: 'PASSIF' }];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!code || !intitule) return; setLoading(true);
    try {
      await rubriqueService.save({
        id: initialValues?.id, code: code.trim().toUpperCase(), intitule: intitule.trim(), typeEtat, nature, modeCalcul, ordre: Number(ordre), parentId,
        plageComptesPrincipal: modeCalcul === 'COMPTES' ? plagePrincipal.trim() : undefined,
        plageComptesCorrectif: (modeCalcul === 'COMPTES' && typeEtat === 'BILAN') ? plageCorrectif.trim() : undefined,
        sensSoldeAdmis: modeCalcul === 'COMPTES' ? sensSolde : 'TOUS'
      });
      
      setCode(''); setIntitule(''); setPlagePrincipal(''); setPlageCorrectif(''); setParentId(null); setOrdre('10');
      
      // 💡 ENCHAÎNEMENT SYNCHRONE : Force la reconstruction instantanée du dictionnaire
      onSuccess();
      await chargerRubriquesPivots();
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const getPlaceholderPrincipal = () => {
    if (typeEtat === 'BILAN') return "Racines brutes séparées par virgules. Ex: 21,22,24,25";
    if (typeEtat === 'COMPTE_RESULTAT') return "Comptes de gestion classe 6 ou 7. Ex: 701,706 ou 601,605";
    return "Racines de trésorerie directes ou de gestion. Ex: 521,571,701";
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 rounded-xl border shadow-sm ${initialValues ? 'bg-sky-accent-50/20 border-sky-accent-200 dark:bg-navy-900/60' : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800'}`}>
      {initialValues && (
        <div className="flex justify-between items-center bg-sky-accent-500/10 text-sky-accent-700 text-[10px] font-black uppercase px-3 py-1 rounded-md">
          <span>⚠️ Édition de [{initialValues.code}]</span><button type="button" onClick={onCancelEdit} className="text-rose-600 hover:underline cursor-pointer lowercase font-bold">Annuler l'édition</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Code Ligne Unique</label><Input value={code} onChange={e => setCode(e.target.value)} required className="text-xs font-mono font-bold" /></div>
        <div className="flex flex-col gap-1.5 md:col-span-2"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Désignation du Poste</label><Input value={intitule} onChange={e => setIntitule(e.target.value)} required className="text-xs font-bold" /></div>
        
        {/* 💡 CORRECTION DU COMPOSANT : Ajout du filtrage et de la hauteur de panel maximale pour lever le bridage à 5 lignes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200">Rattacher au Parent</label>
          <Select 
            value={parentId} 
            options={listeParentsPossibles} 
            onChange={(e: any) => setParentId(e.value)} 
            placeholder="Sélectionner un parent..." 
            filter
            panelClassName="max-h-[260px] overflow-y-auto thin-scrollbar"
            className="flex-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Nature Comptable</label><Select value={nature} options={optionsNature} onChange={(e: any) => setNature(e.value)} className="w-full text-xs" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Mode Opératoire</label><Select value={modeCalcul} options={[{ label: 'COMPTES', value: 'COMPTES' }, { label: 'SOMME', value: 'SOMME' }]} onChange={(e: any) => setModeCalcul(e.value)} className="w-full text-xs" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Sens Solde</label><Select value={sensSolde} options={[{ label: 'Tous Soldes', value: 'TOUS' }, { label: 'Débiteur', value: 'DEBITEUR' }, { label: 'Créditeur', value: 'CREDITEUR' }]} onChange={(e: any) => setSensSolde(e.value)} className="w-full text-xs" disabled={modeCalcul === 'SOMME'} /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Index Ordre</label><Input type="number" value={ordre} onChange={e => setOrdre(e.target.value)} required className="text-xs font-bold" /></div>
      </div>
      {modeCalcul === 'COMPTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-navy-100 pt-3">
          <div className={typeEtat === 'BILAN' ? "flex flex-col gap-1.5" : "flex flex-col gap-1.5 md:col-span-2"}><label className="text-xs font-bold text-emerald-700">{typeEtat === 'BILAN' ? "Comptes Principaux (Brut)" : "Comptes de Gestion (Produits / Charges)"}</label><Input value={plagePrincipal} onChange={e => setPlagePrincipal(e.target.value)} required placeholder={getPlaceholderPrincipal()} className="text-xs font-mono font-bold" /></div>
          {typeEtat === 'BILAN' && ( <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-rose-700">Comptes Correctifs (Amortissements)</label><Input value={plageCorrectif} onChange={e => setPlageCorrectif(e.target.value)} placeholder="Racines correctives. Ex: 281,282,284" className="text-xs font-mono font-bold" /></div> )}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
        {initialValues && ( <Button type="button" variant="outline" size="sm" onClick={onCancelEdit} className="h-[38px] text-xs font-bold uppercase">Annuler</Button> )}
        <Button type="submit" disabled={loading} className={`w-[220px] h-[38px] font-bold uppercase text-xs ${initialValues ? 'bg-sky-accent-600 hover:bg-sky-accent-700' : ''}`}>{loading ? 'Validation...' : initialValues ? 'Modifier la règle' : 'Enregistrer la règle'}</Button>
      </div>
    </form>
  );
};
