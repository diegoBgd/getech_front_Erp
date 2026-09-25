import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input'; import { Select } from '../ui/select'; import { Button } from '../ui/button';
import { useExerciceGlobal } from '../../contexts/ExerciceContext'; import { ecritureService } from '@/services/ecriture.service';
import type { LigneEcritureDto } from '@/types';

interface SaisieFormProps { journaux: { label: string; value: string }[]; comptes: { label: string; value: string }[]; loading: boolean; onSubmit: (data: any) => Promise<void>; initialValues?: any; isReadOnly?: boolean; onCancelEdit?: () => void; }
interface LigneSaisieForm extends LigneEcritureDto { idUnique: string; displayDebit?: string; displayCredit?: string; soldeActuel?: number; }

export const SaisieEcritureForm: React.FC<SaisieFormProps> = ({ journaux, comptes, loading, onSubmit, initialValues, isReadOnly = false, onCancelEdit }) => {
  const [codeJournal, setCodeJournal] = useState(''); const [libelleGeneral, setLibelleGeneral] = useState('');
  const [datePiece, setDatePiece] = useState(new Date().toISOString().split('T')[0]); const { exerciceId } = useExerciceGlobal();
  const [lignes, setLignes] = useState<LigneSaisieForm[]>([{ idUnique: '1', codeCompte: '', libelleLigne: '', debit: 0, credit: 0, displayDebit: '', displayCredit: '', soldeActuel: 0 }, { idUnique: '2', codeCompte: '', libelleLigne: '', debit: 0, credit: 0, displayDebit: '', displayCredit: '', soldeActuel: 0 }]);

  const fmtIn = (n: number) => (!n || isNaN(n)) ? '' : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n).replace(/,/g, ' ');
  const getSolde = async (id: string, cc: string, ex: number) => {
    try { const s = await ecritureService.obtenirSoldeCompteFlash(ex, cc); setLignes(p => p.map(l => l.idUnique === id ? { ...l, soldeActuel: s } : l)); } catch { }
  };

  const handleViderFormulaire = () => {
    setCodeJournal(''); setLibelleGeneral(''); setDatePiece(new Date().toISOString().split('T')[0]);
    setLignes([{ idUnique: '1', codeCompte: '', libelleLigne: '', debit: 0, credit: 0, displayDebit: '', displayCredit: '', soldeActuel: 0 }, { idUnique: '2', codeCompte: '', libelleLigne: '', debit: 0, credit: 0, displayDebit: '', displayCredit: '', soldeActuel: 0 }]);
    if (onCancelEdit) onCancelEdit();
  };

  useEffect(() => {
    if (initialValues) {
      setCodeJournal(initialValues.codeJournal || ''); setLibelleGeneral(initialValues.libelleGeneral || initialValues.reference || '');
      if (initialValues.datePiece) setDatePiece(initialValues.datePiece);
      if (initialValues.lignes && Array.isArray(initialValues.lignes)) {
        const chg = initialValues.lignes.map((l: any, i: number) => {
          const d = Number(l.debit) || 0, c = Number(l.credit) || 0;
          return { idUnique: `L-${i}-${Date.now()}`, codeCompte: l.codeCompte || '', libelleLigne: l.libelleLigne || '', debit: d, credit: c, displayDebit: fmtIn(d), displayCredit: fmtIn(c), soldeActuel: 0 };
        });
        setLignes(chg); if (exerciceId) chg.forEach((l: any) => l.codeCompte && getSolde(l.idUnique, l.codeCompte, Number(exerciceId)));
      }
    } else { handleViderFormulaire(); }
  }, [initialValues, exerciceId]);

  const changeL = (id: string, f: keyof LigneEcritureDto | 'displayDebit' | 'displayCredit', v: any) => {
    if (isReadOnly) return;
    setLignes(p => p.map(l => {
      if (l.idUnique !== id) return l; const r = { ...l };
      if (f === 'displayDebit' || f === 'displayCredit') {
        const n = Math.abs(parseFloat(String(v).replace(/\s/g, '').replace(/[^0-9]/g, '')) || 0);
        if (f === 'displayDebit') { r.debit = n; r.displayDebit = fmtIn(n); if (n > 0) { r.credit = 0; r.displayCredit = ''; } }
        else { r.credit = n; r.displayCredit = fmtIn(n); if (n > 0) { r.debit = 0; r.displayDebit = ''; } }
      } else if (f === 'codeCompte') { const cc = String(v?.value || v || ''); r.codeCompte = cc; if (exerciceId) setTimeout(() => getSolde(id, cc, Number(exerciceId)), 50); }
      else { (r as any)[f] = v; } return r;
    }));
  };

  const tD = lignes.reduce((s, l) => s + (Number(l.debit) || 0), 0), tC = lignes.reduce((s, l) => s + (Number(l.credit) || 0), 0), eq = tD > 0 && Math.abs(tD - tC) < 0.01;

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (codeJournal && exerciceId && eq) onSubmit({ id: initialValues?.id, codeJournal, idExercice: Number(exerciceId), reference: libelleGeneral.trim(), datePiece, lignes: lignes.map(({ idUnique, displayDebit, displayCredit, soldeActuel, ...p }) => ({ ...p, libelleLigne: p.libelleLigne.trim() || libelleGeneral.trim() })) }); }} className="space-y-4 font-sans antialiased">
      <div className="grid grid-cols-1 md:grid-cols-[50%_15%_30%] gap-4 p-4 bg-navy-50/40 rounded-xl border border-navy-100">
        <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-400">Journal *</label><Select value={codeJournal} options={journaux} filter onChange={e => setCodeJournal(e.value)} disabled={isReadOnly} required className="text-xs font-bold" /></div>
        <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-400">Date *</label><Input type="date" value={datePiece} onChange={e => setDatePiece(e.target.value)} required className="text-xs font-bold" /></div>
        <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-400">Libellé Général</label><Input type="text" value={libelleGeneral} onChange={e => setLibelleGeneral(e.target.value)} placeholder="Désignation..." className="text-xs font-bold" /></div>
      </div>
      <div className="flex justify-between items-center p-3 bg-white border border-navy-200 rounded-xl text-xs font-bold text-navy-900">
        <div className="flex gap-6">
          <span className="text-emerald-700 font-black">DÉBIT : {new Intl.NumberFormat('fr-BI').format(tD)}</span>
          <span className="text-rose-700 font-black">CRÉDIT : {new Intl.NumberFormat('fr-BI').format(tC)}</span>
          <span className={`px-2 py-0.5 rounded font-bold ${eq ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{eq ? '✓ ÉQUILIBRÉ' : '⚠️ ÉCART'}</span>
        </div>
        {!isReadOnly && <Button type="button" variant="outline" size="sm" onClick={() => setLignes([...lignes, { idUnique: `A-${Date.now()}`, codeCompte: '', libelleLigne: libelleGeneral, debit: 0, credit: 0, displayDebit: '', displayCredit: '', soldeActuel: 0 }])} className="text-xs h-8 font-bold">+ Ajouter une ligne</Button>}
      </div>
      <div className="w-full overflow-hidden border border-navy-200 bg-white rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-navy-50 font-bold border-b border-navy-200 [&_th]:p-2 text-navy-800 text-[11px]"><th className="w-[320px] pl-4">Compte Général</th><th>Libellé de l'écriture</th><th className="w-[140px] text-right pr-4">Débit</th><th className="w-[140px] text-right pr-4">Crédit</th>{!isReadOnly && <th className="w-[50px] text-center">X</th>}</tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {lignes.map((l) => (
              <tr key={l.idUnique} className="[&_td]:p-2 hover:bg-navy-50/10">
                <td className="pl-4 flex flex-col gap-1">
                  <Select value={l.codeCompte || ''} options={comptes} filter onChange={e => changeL(l.idUnique, 'codeCompte', e.value)} disabled={isReadOnly} className="w-full text-xs font-bold" />
                  {l.codeCompte && <span className={`text-[10px] font-black tracking-wide ${l.soldeActuel && l.soldeActuel >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>ℹ️ Solde : {new Intl.NumberFormat('fr-BI').format(Math.abs(l.soldeActuel || 0))} Fbu {l.soldeActuel && l.soldeActuel >= 0 ? '(Db)' : '(Cr)'}</span>}
                </td>
                <td><Input type="text" value={l.libelleLigne || ''} onChange={e => changeL(l.idUnique, 'libelleLigne', e.target.value)} placeholder="Opération..." className="w-full text-xs font-bold uppercase" /></td>
                <td><Input type="text" value={l.displayDebit || ''} onChange={e => changeL(l.idUnique, 'displayDebit', e.target.value)} placeholder="0" className="w-full text-right text-emerald-700 font-black pr-2" /></td>
                <td><Input type="text" value={l.displayCredit || ''} onChange={e => changeL(l.idUnique, 'displayCredit', e.target.value)} placeholder="0" className="w-full text-right text-rose-700 font-black pr-2" /></td>
                {!isReadOnly && <td className="text-center"><Button type="button" variant="ghost" disabled={lignes.length <= 2} onClick={() => setLignes(lignes.filter(x => x.idUnique !== l.idUnique))} className="text-rose-600 p-1 h-7 w-7"><i className="pi pi-trash text-xs" /></Button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
        <Button type="button" variant="outline" size="sm" onClick={handleViderFormulaire} className="font-bold text-xs h-[34px] text-navy-500 border-navy-200 hover:bg-navy-50"><i className="pi pi-refresh mr-2 text-xs"></i> Nouvelle Saisie / Annuler</Button>
        {!isReadOnly && <Button type="submit" disabled={loading || !eq || !exerciceId} className="font-bold text-xs px-6 h-[34px]">{loading ? <i className="pi pi-spinner mr-2 text-xs"></i> : <i className="pi pi-save mr-2 text-xs"></i>} Enregistrer la pièce</Button>}
      </div>
    </form>
  );
};
