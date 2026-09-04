import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { useExerciceGlobal } from '../../contexts/ExerciceContext';
import type { LigneEcritureDto } from '@/types';

interface SaisieFormProps {
  journaux: { label: string; value: string }[];
  comptes: { label: string; value: string }[];
  loading: boolean;
  onSubmit: (data: any) => Promise<void>;
  initialValues?: any;
  isReadOnly?: boolean;
}

interface LigneSaisieForm extends LigneEcritureDto { idUnique: string; }

export const SaisieEcritureForm: React.FC<SaisieFormProps> = ({ journaux, comptes, loading, onSubmit, initialValues, isReadOnly = false }) => {
  const [codeJournal, setCodeJournal] = useState('');
  const [libelleGeneral, setLibelleGeneral] = useState('');
  const [datePiece, setDatePiece] = useState(new Date().toISOString().split('T')[0]);
  
  // 💡 INJECTION DIRECTE DE L'EXERCICE DE LA TOPBAR
  const { exerciceId } = useExerciceGlobal();

  const [lignes, setLignes] = useState<LigneSaisieForm[]>([
    { idUnique: '1', codeCompte: '', libelleLigne: '', debit: 0, credit: 0 },
    { idUnique: '2', codeCompte: '', libelleLigne: '', debit: 0, credit: 0 }
  ]);

  useEffect(() => {
    if (initialValues) {
      setCodeJournal(initialValues.codeJournal || '');
      setLibelleGeneral(initialValues.libelleGeneral || initialValues.reference || '');
      if (initialValues.datePiece) setDatePiece(initialValues.datePiece);
      if (initialValues.lignes && Array.isArray(initialValues.lignes)) {
        setLignes(initialValues.lignes.map((l: any, i: number) => ({
          idUnique: `L-${i}-${Date.now()}`,
          codeCompte: l.codeCompte || '',
          libelleLigne: l.libelleLigne || '',
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0
        })));
      }
    } else {
      setCodeJournal(''); setLibelleGeneral(''); setDatePiece(new Date().toISOString().split('T')[0]);
      setLignes([
        { idUnique: '1', codeCompte: '', libelleLigne: '', debit: 0, credit: 0 },
        { idUnique: '2', codeCompte: '', libelleLigne: '', debit: 0, credit: 0 }
      ]);
    }
  }, [initialValues]);

  const handleLigneChange = (idUnique: string, field: keyof LigneEcritureDto, val: any) => {
    if (isReadOnly) return;
    setLignes(prev => prev.map(l => {
      if (l.idUnique !== idUnique) return l;
      const r = { ...l };
      if (field === 'debit' || field === 'credit') {
        const num = Math.abs(parseFloat(val) || 0);
        r[field] = num;
        if (num > 0) r[field === 'debit' ? 'credit' : 'debit'] = 0;
      } else if (field === 'codeCompte') {
        r.codeCompte = String(val?.value || val || '');
      } else { (r as any)[field] = val; }
      return r;
    }));
  };

  const totalDebit = lignes.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lignes.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const estEquilibre = totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (codeJournal && exerciceId && estEquilibre && !isReadOnly) {
        // 💡 PAYLOAD ENTIÈREMENT SÉCURISÉ AVEC IDEXERCICE DYNAMIQUE
        onSubmit({
          id: initialValues?.id,
          numeroPiece: initialValues?.numeroPiece || '',
          codeJournal,
          idExercice: Number(exerciceId),
          reference: libelleGeneral.trim(),
          datePiece,
          lignes: lignes.map(({ idUnique, ...pureLigne }) => ({
            ...pureLigne,
            libelleLigne: pureLigne.libelleLigne.trim() || libelleGeneral.trim() || 'Écriture'
          }))
        });
      }
    }} className="space-y-4">
      
      {/* 📅 EN-TÊTE ÉPURÉ DE PIÈCE ADAPTÉ ET PROPRE */}
      <div className="grid grid-cols-1 md:grid-cols-[45%_20%_30%] gap-4 p-4 bg-navy-50/40 rounded-xl border border-navy-100">
        <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-400">Journal *</label><Select value={codeJournal} options={journaux} filter onChange={e => setCodeJournal(e.value)} disabled={isReadOnly} required className="text-xs font-bold" /></div>
        <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-400">Date *</label><Input type="date" value={datePiece} onChange={e => setDatePiece(e.target.value)} required className="text-xs font-bold" /></div>
        <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-400">Libellé / Référence Général</label><Input type="text" value={libelleGeneral} onChange={e => setLibelleGeneral(e.target.value)} placeholder="Désignation de l'opération..." className="text-xs font-bold" /></div>
      </div>

      <div className="flex justify-between items-center p-3 bg-white dark:bg-navy-900 border border-navy-200 rounded-xl text-xs font-bold font-mono">
        <div className="flex gap-6">
          <span className="text-emerald-700">DÉBIT : {new Intl.NumberFormat('fr-BI').format(totalDebit)}</span>
          <span className="text-rose-700">CRÉDIT : {new Intl.NumberFormat('fr-BI').format(totalCredit)}</span>
          <span className={`px-2 py-0.5 rounded ${estEquilibre ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{estEquilibre ? '✓ ÉQUILIBRÉ' : '⚠️ ÉCART'}</span>
        </div>
        {!isReadOnly && <Button type="button" variant="outline" size="sm" onClick={() => setLignes([...lignes, { idUnique: `A-${Date.now()}`, codeCompte: '', libelleLigne: lignes[lignes.length - 1]?.libelleLigne || libelleGeneral, debit: 0, credit: 0 }])} className="text-xs  h-8 font-bold">+ Ajouter une ligne</Button>}
      </div>

      <div className="w-full overflow-hidden border border-navy-200 bg-white rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-navy-50 font-bold border-b border-navy-200 [&_th]:p-2 text-navy-800 uppercase text-[11px]"><th className="w-[320px] pl-4">Compte Général</th><th>Libellé de l'écriture</th><th className="w-[140px]">Débit</th><th className="w-[140px]">Crédit</th>{!isReadOnly && <th className="w-[50px] text-center">X</th>}</tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {lignes.map((l) => (
              <tr key={l.idUnique} className="[&_td]:p-2 hover:bg-navy-50/10">
                <td className="pl-4"><Select value={l.codeCompte || ''} options={comptes} filter onChange={e => handleLigneChange(l.idUnique, 'codeCompte', e.value)} disabled={isReadOnly} className="w-full text-xs font-mono font-bold" /></td>
                <td><Input type="text" value={l.libelleLigne || ''} onChange={e => handleLigneChange(l.idUnique, 'libelleLigne', e.target.value)} placeholder="Opération..." className="w-full text-xs font-bold uppercase" /></td>
                <td><Input type="number" value={l.debit === 0 ? '' : l.debit} onChange={e => handleLigneChange(l.idUnique, 'debit', e.target.value)} placeholder="0" className="w-full text-right font-mono text-emerald-700 font-bold" /></td>
                <td><Input type="number" value={l.credit === 0 ? '' : l.credit} onChange={e => handleLigneChange(l.idUnique, 'credit', e.target.value)} placeholder="0" className="w-full text-right font-mono text-rose-700 font-bold" /></td>
                {!isReadOnly && <td className="text-center"><Button type="button" variant="ghost" disabled={lignes.length <= 2} onClick={() => setLignes(lignes.filter(x => x.idUnique !== l.idUnique))} className="text-rose-600 p-1 h-7 w-7"><i className="pi pi-trash text-xs" /></Button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isReadOnly && <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading || !estEquilibre || !exerciceId} 
        className="font-bold  text-xs px-6 h-[30px]">
          {loading ?
          <i className="pi pi-spinner mr-2 text-xs"></i>
          :
           <i className="pi pi-save mr-2 text-xs"></i>
          }
          Enregistrer 
        </Button></div>}
    </form>
  );
};
