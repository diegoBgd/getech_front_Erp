import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
      const data = await rubriqueService.getToutesParEtat(typeEtat);
      const options = (data && Array.isArray(data)) ? data.filter(n => n.id !== initialValues?.id).map(n => ({ label: `[${n.code}] ${n.intitule.toUpperCase()}`, value: n.id! })) : [];
      setListeParentsPossibles([{ label: 'AUCUN PARENT (NIVEAU 0)', value: null }, ...options]);
    } catch (err) { 
      console.warn("Échec d'extraction des parents : Serveur déconnecté."); 
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
      const pCorrectif = (modeCalcul === 'COMPTES' && typeEtat === 'BILAN') ? plageCorrectif.trim() : undefined;
      await rubriqueService.save({
        id: initialValues?.id, code: code.trim().toUpperCase(), intitule: intitule.trim(), typeEtat, nature, modeCalcul, ordre: Number(ordre), parentId,
        plageComptesPrincipal: modeCalcul === 'COMPTES' ? plagePrincipal.trim() : undefined,
        plageComptesCorrectif: pCorrectif, sensSoldeAdmis: modeCalcul === 'COMPTES' ? sensSolde : 'TOUS'
      });
      setCode(''); setIntitule(''); setPlagePrincipal(''); setPlageCorrectif(''); setParentId(null); setOrdre('10');
      onSuccess();
      await chargerRubriquesPivots();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 rounded-xl border border-navy-100 bg-white dark:bg-navy-900 dark:border-navy-800 shadow-sm animate-fade-in">
      {initialValues && (
        <div className="bg-sky-accent-500/10 text-sky-accent-700 text-[10px] font-black uppercase px-3 py-1 rounded-md flex justify-between">
          <span>⚠️ Édition de [{initialValues.code}]</span>
          <button type="button" onClick={onCancelEdit} className="text-rose-600 underline lowercase font-bold">Annuler</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Code Ligne Unique</label><Input value={code} onChange={e => setCode(e.target.value)} required className="text-xs font-mono font-bold" /></div>
        <div className="flex flex-col gap-1.5 md:col-span-2"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Désignation du Poste</label><Input value={intitule} onChange={e => setIntitule(e.target.value)} required className="text-xs font-bold" /></div>
        
        {/* 💡 SÉCURISATION NATIVE ABSOLUE : Utilisation d'un élément select HTML pur stylisé pour contourner les bridages du moteur unstyled */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200">Rattacher au Parent</label>
          <select 
            value={parentId || ''} 
            onChange={e => setParentId(e.target.value ? Number(e.target.value) : null)}
            className="w-full h-[30px] px-2 rounded-md border border-navy-200 bg-white text-xs font-bold text-navy-900 dark:bg-navy-950 dark:border-navy-700 dark:text-navy-50 outline-hidden"
          >
            {listeParentsPossibles.map(o => (
              <option key={String(o.value)} value={o.value || ''}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200">Nature</label>
          <select value={nature} onChange={e => setNature(e.target.value as any)} className="w-full h-[30px] px-2 rounded-md border border-navy-200 bg-white text-xs font-bold text-navy-900 dark:bg-navy-950 dark:border-navy-700 dark:text-navy-50 outline-hidden">
            {optionsNature.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200">Mode</label>
          <select value={modeCalcul} onChange={e => setModeCalcul(e.target.value as any)} className="w-full h-[30px] px-2 rounded-md border border-navy-200 bg-white text-xs font-bold text-navy-900 dark:bg-navy-950 dark:border-navy-700 dark:text-navy-50 outline-hidden">
            <option value="COMPTES">COMPTES</option><option value="SOMME">SOMME</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200">Sens Solde</label>
          <select value={sensSolde} onChange={e => setSensSolde(e.target.value as any)} disabled={modeCalcul === 'SOMME'} className="w-full h-[30px] px-2 rounded-md border border-navy-200 bg-white text-xs font-bold text-navy-900 dark:bg-navy-950 dark:border-navy-700 dark:text-navy-50 outline-hidden disabled:bg-navy-50">
            <option value="TOUS">Tous Soldes</option><option value="DEBITEUR">Débiteur</option><option value="CREDITEUR">Créditeur</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-navy-800 dark:text-navy-200">Index Ordre</label><Input type="number" value={ordre} onChange={e => setOrdre(e.target.value)} required className="text-xs font-bold" /></div>
      </div>
      {modeCalcul === 'COMPTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-navy-100 pt-3">
          <div className={typeEtat === 'BILAN' ? "flex flex-col gap-1.5" : "flex flex-col gap-1.5 md:col-span-2"}><label className="text-xs font-bold text-emerald-700">{typeEtat === 'BILAN' ? "Comptes Principaux (Brut)" : "Comptes de Gestion (Produits / Charges)"}</label><Input value={plagePrincipal} onChange={e => setPlagePrincipal(e.target.value)} required placeholder={typeEtat === 'BILAN' ? "Ex: 21,22,24" : "Ex: 701,605"} className="text-xs font-mono font-bold" /></div>
          {typeEtat === 'BILAN' && ( <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-rose-700">Comptes Correctifs (Amortissements)</label><Input value={plageCorrectif} onChange={e => setPlageCorrectif(e.target.value)} placeholder="Ex: 281,284" className="text-xs font-mono font-bold" /></div> )}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
        {initialValues && ( <Button type="button" variant="outline" size="sm" onClick={onCancelEdit} className="h-[38px] text-xs font-bold uppercase">Annuler</Button> )}
        <Button type="submit" disabled={loading} className={`w-[220px] h-[38px] font-bold uppercase text-xs ${initialValues ? 'bg-sky-accent-600 hover:bg-sky-accent-700' : ''}`}>{loading ? 'Validation...' : initialValues ? 'Modifier la règle' : 'Enregistrer la règle'}</Button>
      </div>
    </form>
  );
};
