import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from '@/components/ui/button';

interface VoletProps {
  visible: boolean;
  onHide: () => void;
  piece: any;
  fmt: (v: number) => string;
  onOuvrirRejet: () => void;
  onOuvrirApprobation: () => void;
}

export const VoletAuditValidation: React.FC<VoletProps> = ({
  visible, onHide, piece, fmt, onOuvrirRejet, onOuvrirApprobation
}) => {
  if (!piece) return null;

  return (
    <Dialog header={`🔍 Audit : ${piece.numeroPiece || ''}`} visible={visible} onHide={onHide} modal style={{ width: '800px' }} className="font-sans" contentClassName="p-4 bg-white dark:bg-navy-900" headerClassName="p-4 bg-navy-50/50 border-b font-bold text-sm text-navy-800">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-medium text-slate-600">
          <div>Date : <span className="font-bold text-navy-900">{piece.datePiece ? new Date(piece.datePiece).toLocaleDateString('fr-FR') : ''}</span></div>
          <div>Journal : <span className="font-bold text-sky-700">{piece.codeJournal}</span></div>
          <div>Libellé : <span className="font-bold text-navy-900 uppercase">{piece.reference || 'SANS LIBELLÉ'}</span></div>
        </div>
        
        <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-navy-50 border-b border-navy-100">
              <tr className="text-[10px] font-bold text-navy-400 uppercase tracking-wider [&_th]:p-2">
                <th className="pl-3 w-[120px]">N° Compte</th><th>Libellé Écriture</th><th className="text-right w-[130px]">Débit</th><th className="text-right w-[130px] pr-3">Crédit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-navy-800">
              {piece.lignes?.map((l: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 [&_td]:p-2">
                  <td className="pl-3 font-bold text-sky-700">{l.codeCompte}</td>
                  <td className="truncate max-w-[200px] text-slate-500">{l.libelleLigne}</td>
                  <td className="text-right font-bold text-emerald-700">{fmt(l.debit)}</td>
                  <td className="text-right font-bold text-rose-700 pr-3">{fmt(l.credit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onOuvrirRejet} className="text-rose-600 border-rose-200 font-bold text-xs h-9"><i className="pi pi-trash mr-1.5" /> Rejeter</Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onHide} className="text-xs font-bold h-9">Fermer</Button>
            <Button type="button" size="sm" onClick={onOuvrirApprobation} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9"><i className="pi pi-check-circle mr-1.5" /> Valider</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
