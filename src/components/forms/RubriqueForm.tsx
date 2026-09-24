import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button'; import { Input } from '../ui/input'; import { Select } from '../ui/select';
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';

export const RubriqueForm: React.FC<{ typeEtat: 'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'; onSuccess: () => void; initialValues: RubriqueFinanciere | null; onCancelEdit: () => void; }> = ({ typeEtat, onSuccess, initialValues, onCancelEdit }) => {
  const [loading, setLoading] = useState(false); const [code, setCode] = useState(''); const [intitule, setIntitule] = useState('');
  const [nature, setNature] = useState<'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE'>('ACTIF'); const [modeCalcul, setModeCalcul] = useState<'COMPTES' | 'SOMME'>('COMPTES');
  const [plagePrincipal, setPlagePrincipal] = useState(''); const [plageCorrectif, setPlageCorrectif] = useState('');
  const [sensSolde, setSensSolde] = useState<'TOUS' | 'DEBITEUR' | 'CREDITEUR'>('TOUS'); const [ordre, setOrdre] = useState('10');
  const [parentId, setParentId] = useState<number | null>(null); const [listeParentsPossibles, setListeParentsPossibles] = useState<{ label: string; value: number | null }[]>([]);

  useEffect(() => {
    rubriqueService.getToutesParEtat(typeEtat).then(d => {
      const opts = d ? d.filter(n => n.id !== initialValues?.id).map(n => ({ label: `[${n.code}] ${n.intitule.toUpperCase()}`, value: n.id! })) : [];
      setListeParentsPossibles([{ label: 'AUCUN PARENT (NIVEAU 0)', value: null }, ...opts]);
    }).catch(console.error);
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

  useEffect(() => { if (modeCalcul === 'SOMME') setSensSolde('TOUS'); }, [modeCalcul]);
  const optsNat = typeEtat === 'COMPTE_RESULTAT' ? [{ label: 'PRODUIT', value: 'PRODUIT' }, { label: 'CHARGE', value: 'CHARGE' }] : typeEtat === 'FLUX_TRESO' ? [{ label: 'FLUX ENTRANT', value: 'ACTIF' }, { label: 'FLUX SORTANT', value: 'PASSIF' }] : [{ label: 'ACTIF', value: 'ACTIF' }, { label: 'PASSIF', value: 'PASSIF' }];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!intitule) return; setLoading(true);
    try {
      await rubriqueService.save({
        id: initialValues?.id, code: initialValues && code ? code.trim() : undefined, intitule: intitule.trim(), typeEtat, nature, modeCalcul, ordre: Number(ordre), parentId,
        plageComptesPrincipal: modeCalcul === 'COMPTES' ? plagePrincipal.trim() : undefined, plageComptesCorrectif: (modeCalcul === 'COMPTES' && typeEtat === 'BILAN') ? plageCorrectif.trim() : undefined, sensSoldeAdmis: modeCalcul === 'COMPTES' ? sensSolde : 'TOUS'
      });
      onSuccess();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getPPl = () => typeEtat === 'BILAN' ? "Ex: 21-25 (Plage), 16!165 (Exclure), 401,402" : typeEtat === 'COMPTE_RESULTAT' ? "Ex: 701-706, 60!607, 61,62" : "Ex: 521-525, 70!707, 571";

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 rounded-xl border shadow-sm ${initialValues ? 'bg-sky-accent-50/20 border-sky-accent-200 dark:bg-navy-900/60' : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800'}`}>
      {initialValues && (
        <div className="flex justify-between items-center bg-sky-accent-500/10 text-sky-accent-700 text-[10px] font-black px-3 py-1 rounded-md">
          <span>⚠️ Édition [{initialValues.code}]</span><button type="button" onClick={onCancelEdit} className="text-rose-600 hover:underline cursor-pointer font-bold">Annuler</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {!initialValues ? (
          <div className="flex flex-col gap-1.5"><label className="text-xs font-bold">Identifiant Unique</label><div className="h-[30px] flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50/40 border border-emerald-100 px-3 rounded-md font-mono">✨ Auto-généré</div></div>
        ) : (
          <div className="flex flex-col gap-1.5 opacity-60"><label className="text-xs font-bold">Code Technique</label><Input value={code} disabled className="text-xs font-mono font-bold bg-slate-50" /></div>
        )}
        <div className="flex flex-col gap-1.5 md:col-span-2"><label className="text-xs font-bold">Désignation du Poste</label><Input value={intitule} onChange={e => setIntitule(e.target.value)} required placeholder={typeEtat === 'BILAN' ? "Ex: Immobilisations corporelles" : typeEtat === 'COMPTE_RESULTAT' ? "Ex: Chiffre d'affaires" : "Ex: Encaissements clients"} className="text-xs font-bold" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold">Rattacher au Parent</label><Select value={parentId} options={listeParentsPossibles} onChange={(e: any) => setParentId(e.value)} placeholder="Sélectionner un parent" filter panelClassName="max-h-[260px] overflow-y-auto" className="flex-1" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold">Nature</label><Select value={nature} options={optsNat} onChange={(e: any) => setNature(e.value)} className="w-full text-xs" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold">Mode</label><Select value={modeCalcul} options={[{ label: 'COMPTES', value: 'COMPTES' }, { label: 'SOMME', value: 'SOMME' }]} onChange={(e: any) => setModeCalcul(e.value)} className="w-full text-xs" /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold">Sens Solde</label><Select value={sensSolde} options={[{ label: 'Tous', value: 'TOUS' }, { label: 'Débiteur', value: 'DEBITEUR' }, { label: 'Créditeur', value: 'CREDITEUR' }]} onChange={(e: any) => setSensSolde(e.value)} className="w-full text-xs" disabled={modeCalcul === 'SOMME'} /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-bold">Ordre d'affichage</label><Input type="number" value={ordre} onChange={e => setOrdre(e.target.value)} required className="text-xs font-bold" /></div>
      </div>
      {modeCalcul === 'COMPTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-navy-100 pt-3">
          <div className={typeEtat === 'BILAN' ? "flex flex-col gap-1.5" : "flex flex-col gap-1.5 md:col-span-2"}><label className="text-xs font-bold text-emerald-700">Configuration des Plages ou Exclusions de Comptes</label><Input value={plagePrincipal} onChange={e => setPlagePrincipal(e.target.value)} required placeholder={getPPl()} className="text-xs font-mono font-bold" /><span className="text-[10px] text-slate-400">💡 Astuce : Utilisez <b className="text-slate-600">-</b> pour une plage et <b className="text-slate-600">!</b> pour exclure.</span></div>
          {typeEtat === 'BILAN' && (<div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-rose-700">Comptes Correctifs (Amort.)</label><Input value={plageCorrectif} onChange={e => setPlageCorrectif(e.target.value)} placeholder="Ex: 281,282 ou 281-285" className="text-xs font-mono font-bold" /></div>)}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
        {initialValues && (<Button type="button" variant="outline" size="sm" onClick={onCancelEdit} className="h-[38px] text-xs font-bold uppercase">Annuler</Button>)}
        <Button type="submit" disabled={loading} className={`w-[220px] h-[38px] font-bold uppercase text-xs ${initialValues ? 'bg-sky-accent-600 hover:bg-sky-accent-700' : ''}`}>{loading ? 'Validation...' : 'Enregistrer'}</Button>
      </div>
    </form>
  );
};
