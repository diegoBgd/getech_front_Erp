import type { GrandLivreCompteBloc } from '@/types/grandlivre.types';
import React from 'react';

interface TableProps {
  blocs: GrandLivreCompteBloc[];
  totalDebit: number;
  totalCredit: number;
  fmtNum: (val: number) => string;
  fmtDate: (d: string) => string;
}

export const GrandLivreTable: React.FC<TableProps> = ({ blocs, totalDebit, totalCredit, fmtNum, fmtDate }) => {
  return (
    <div className="flex flex-col gap-8 font-sans antialiased">
      {blocs.map((bloc, idx) => {
        const tDeb = bloc.ecritures.reduce((s, e) => s + e.debit, 0);
        const tCred = bloc.ecritures.reduce((s, e) => s + e.credit, 0);
        return (
          <div key={idx} className="w-full overflow-hidden border border-navy-900 bg-white">
            <table className="w-full text-left border-collapse text-xs text-navy-900">
              <thead>
                <tr className="bg-white border-b border-navy-900 [&_th]:p-2 [&_th]:font-normal [&_th]:border-r [&_th]:border-navy-900 last:[&_th]:border-r-0">
                  <th style={{ width: '12%' }}>Date</th>
                  <th style={{ width: '10%' }}>Journal</th>
                  <th style={{ width: '15%' }}>N° pièce</th>
                  <th style={{ width: '13%' }}>Référence</th>
                  <th style={{ width: '30%' }}>Libellé</th>
                  <th style={{ width: '10%' }}>Débit</th>
                  <th style={{ width: '10%' }}>Crédit</th>
                </tr>
                <tr className="border-b border-navy-900 font-bold bg-white">
                  <td colSpan={7} className="p-2 px-3 text-sm">
                    {/* 💡 NETTOYAGE : Utilisation de font-sans antialiased pour lisser les zéros du code compte */}
                    <span className="font-sans antialiased font-black">{bloc.codeCompte}</span> : {bloc.intituleCompte}
                  </td>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900 [&_td]:p-2 [&_td]:px-3 [&_td]:border-r [&_td]:border-navy-900 last:[&_td]:border-r-0 bg-white">
                {bloc.ecritures.map((e, eIdx) => (
                  <tr key={eIdx} className="hover:bg-navy-50/10">
                    <td className="font-sans antialiased font-medium text-slate-500">{fmtDate(e.datePiece)}</td>
                    <td className="font-semibold uppercase">{e.codeJournal}</td>
                    <td className="font-sans antialiased font-bold text-sky-600">{e.numeroPiece}</td>
                    <td className="font-sans antialiased">{e.reference || ''}</td>
                    <td className="uppercase">{e.libelleLigne}</td>
                    {/* 💡 NETTOYAGE : font-tabular remplacé pour adoucir le rendu des montants de lignes */}
                    <td className="font-sans antialiased text-right font-semibold text-emerald-700">{fmtNum(e.debit)}</td>
                    <td className="font-sans antialiased text-right font-semibold text-rose-700">{fmtNum(e.credit)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-white">
                  <td colSpan={5} className="p-2 px-3 text-navy-600">Total Compte</td>
                  <td className="font-sans antialiased text-right text-emerald-700">{fmtNum(tDeb) || '0'}</td>
                  <td className="font-sans antialiased text-right text-rose-700">{fmtNum(tCred) || '0'}</td>
                </tr>
                <tr className="font-bold bg-white">
                  <td colSpan={5} className="p-2 px-3 text-navy-600">Solde Compte</td>
                  <td className="font-sans antialiased text-right text-emerald-600 font-black">
                    {bloc.soldeFinalDebiteur > 0 ? fmtNum(bloc.soldeFinalDebiteur) : ''}
                  </td>
                  <td className="font-sans antialiased text-right text-rose-600 font-black">
                    {bloc.soldeFinalCrediteur > 0 ? fmtNum(bloc.soldeFinalCrediteur) : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      <div className="w-full overflow-hidden border-2 border-navy-900 bg-navy-50/40 p-1 mt-2">
        <table className="w-full text-left border-collapse text-xs font-bold text-navy-950">
          <tbody>
            <tr className="[&_td]:p-2.5 [&_td]:px-3">
              <td style={{ width: '80%' }} className="uppercase text-sm font-black">TOTAL GÉNÉRAL DU GRAND LIVRE</td>
              {/* 💡 NETTOYAGE : Application de font-sans antialiased sur le récapitulatif final */}
              <td style={{ width: '10%' }} className="font-sans antialiased text-right font-black text-sm border-l border-navy-900 bg-white text-emerald-700">{fmtNum(totalDebit) || '0'}</td>
              <td style={{ width: '10%' }} className="font-sans antialiased text-right font-black text-sm border-l border-navy-900 bg-white text-rose-700">{fmtNum(totalCredit) || '0'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
