import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Divider } from 'primereact/divider';
import type { LigneEcritureSaisie, PieceComptableSaisie } from '@/types';


interface SaisieFormProps {
  journaux: any[];
  exercices: any[];
  comptes: any[];
  loading: boolean;
  onSubmit: (data: PieceComptableSaisie) => Promise<void>;
}

export const SaisieEcritureForm: React.FC<SaisieFormProps> = ({
  journaux, exercices, comptes, loading, onSubmit
}) => {
  const [codeJournal, setCodeJournal] = useState<string>('');
  const [idExercice, setIdExercice] = useState<number | null>(null);
  const [reference, setReference] = useState<string>('');
  const [datePiece, setDatePiece] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [lignes, setLignes] = useState<LigneEcritureSaisie[]>([
    { codeCompte: '', libelle: '', debit: 0, credit: 0 },
    { codeCompte: '', libelle: '', debit: 0, credit: 0 }
  ]);

  const handleLigneChange = (idx: number, field: keyof LigneEcritureSaisie, val: any) => {
    const newLignes = [...lignes];
    if (field === 'debit' || field === 'credit') {
      const num = Math.abs(parseFloat(val) || 0);
      newLignes[idx][field] = num;
      if (num > 0) newLignes[idx][field === 'debit' ? 'credit' : 'debit'] = 0;
    } else {
      newLignes[idx][field] = val;
    }
    setLignes(newLignes);
  };

  const ajouterLigne = () => {
    const lastLib = lignes[lignes.length - 1]?.libelle || reference || '';
    setLignes([...lignes, { codeCompte: '', libelle: lastLib, debit: 0, credit: 0 }]);
  };

  const supprimerLigne = (idx: number) => {
    if (lignes.length > 2) setLignes(lignes.filter((_, i) => i !== idx));
  };

  const totalDebit = lignes.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = lignes.reduce((sum, l) => sum + l.credit, 0);
  const ecart = Math.abs(totalDebit - totalCredit);
  const estEquilibre = totalDebit > 0 && ecart === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeJournal || !idExercice || !estEquilibre) return;
    onSubmit({ codeJournal, idExercice, reference, datePiece, lignes });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* SECTION 1 : EN-TÊTE DE PIÈCE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-navy-50/30 rounded-lg">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-navy-700">Journal *</label>
          <Select value={codeJournal} options={journaux} onChange={(e) => setCodeJournal(e.value)} placeholder="Choisir..." required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-navy-700">Exercice *</label>
          <Select value={idExercice} options={exercices} onChange={(e) => setIdExercice(e.value)} placeholder="Choisir..." required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-navy-700">Date *</label>
          <Input type="date" value={datePiece} onChange={(e) => setDatePiece(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-navy-700">Référence</label>
          <Input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ex: FAC-001" />
        </div>
      </div>

      {/* SECTION 2 : GRID DES LIGNES DYNAMIQUES */}
      <div className="overflow-x-auto rounded-lg border border-navy-100">
        <table className="w-full border-collapse text-xs bg-white text-left">
          <thead>
            <tr className="bg-navy-50/50 border-b border-navy-100 [&_th]:p-3 [&_th]:font-semibold [&_th]:border-r [&_th]:border-navy-100 last:[&_th]:border-0">
              <th style={{ width: '25%' }}>Compte</th>
              <th style={{ width: '40%' }}>Libellé de ligne</th>
              <th style={{ width: '13%' }} className="text-right">Débit</th>
              <th style={{ width: '13%' }} className="text-right">Crédit</th>
              <th style={{ width: '9%' }} className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 [&_td]:p-2 [&_td]:border-r [&_td]:border-navy-100 last:[&_td]:border-r-0">
            {lignes.map((ligne, idx) => (
              <tr key={idx}>
                <td><Select value={ligne.codeCompte} options={comptes} onChange={(e) => handleLigneChange(idx, 'codeCompte', e.value)} placeholder="Compte..." filter /></td>
                <td><Input type="text" value={ligne.libelle} onChange={(e) => handleLigneChange(idx, 'libelle', e.target.value)} placeholder="Libellé..." /></td>
                <td><Input type="number" value={ligne.debit || ''} onChange={(e) => handleLigneChange(idx, 'debit', e.target.value)} className="text-right" placeholder="0" min="0" step="0.01" /></td>
                <td><Input type="number" value={ligne.credit || ''} onChange={(e) => handleLigneChange(idx, 'credit', e.target.value)} className="text-right" placeholder="0" min="0" step="0.01" /></td>
                <td className="text-center">
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 text-red-accent-500 rounded-full" onClick={() => supprimerLigne(idx)} disabled={lignes.length <= 2}>
                    <i className="pi pi-times text-xs"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex">
        <Button type="button" variant="outline" size="sm" onClick={ajouterLigne}>
          <i className="pi pi-plus text-xs mr-1"></i> Ajouter une ligne
        </Button>
      </div>

      {/* SECTION 3 : INDICATEUR D'ÉQUILIBRE FINANCIER */}
      <div className={`grid grid-cols-1 md:grid-cols-3 p-4 rounded-lg border font-semibold ${
        estEquilibre ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-accent-500 border-red-200'
      }`}>
        <div className="flex flex-col"><span className="text-xs font-normal text-navy-400">Total Débit</span>{totalDebit.toFixed(2)} BIF</div>
        <div className="flex flex-col"><span className="text-xs font-normal text-navy-400">Total Crédit</span>{totalCredit.toFixed(2)} BIF</div>
        <div className="flex items-center md:justify-end">
          <span className="px-2.5 py-1 text-xs uppercase rounded-md bg-white border">
            {estEquilibre ? '✓ Équilibrée' : '⚠️ Déséquilibrée'}
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <Button type="submit" variant="default" size="sm" disabled={loading || !estEquilibre || !codeJournal || !idExercice}>
          {loading ? 'Validation...' : 'Enregistrer la Pièce'}
        </Button>
      </div>
    </form>
  );
};
