import React from 'react';

interface Props { ecritures: any[]; fmt: (v: number) => string; }

export const TableAuditCloture: React.FC<Props> = ({ ecritures, fmt }) => {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto w-full bg-white relative">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="sticky top-0 z-10 bg-navy-50 border-b border-navy-100 shadow-xs">
          <tr className="text-[10px] font-bold text-navy-400 uppercase tracking-wider [&_th]:p-2.5">
            <th className="pl-4 w-[110px] bg-navy-50">N° Compte</th>
            <th className="bg-navy-50">Désignation Compte</th>
            <th className="bg-navy-50">Libellé de régularisation</th>
            <th className="text-right w-[140px] bg-navy-50">Débit</th>
            <th className="text-right w-[140px] pr-4 bg-navy-50">Crédit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 font-sans antialiased text-navy-800">
          {ecritures.map((l: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/40 [&_td]:p-2">
              <td className="pl-4 font-black text-sky-700">{l.codeCompte}</td>
              <td className="truncate max-w-[220px] text-slate-500 font-medium">{l.intituleCompte}</td>
              <td className="uppercase text-slate-400 font-medium text-[10px]">{l.libelleLigne}</td>
              <td className="text-right font-black text-emerald-700">{fmt(l.debit)}</td>
              <td className="text-right font-black text-rose-700 pr-4">{fmt(l.credit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
