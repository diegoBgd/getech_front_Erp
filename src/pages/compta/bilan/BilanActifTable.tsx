import type { LigneActifDto } from '@/services/bilan.service';
import React from 'react';

interface ActifTableProps {
  lignes: LigneActifDto[];
  formatMontant: (valeur: number) => string;
  formatDate: (dateStr: string) => string;
}

export const BilanActifTable: React.FC<ActifTableProps> = ({ lignes, formatMontant }) => {
  return (
    <div className="border border-navy-100 dark:border-navy-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-navy-950">
      <div className="bg-navy-50/50 dark:bg-navy-800/40 p-3 border-b border-navy-100 dark:border-navy-800">
        <span className="text-xs font-bold text-navy-800 dark:text-navy-100 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Lignes de l'Actif
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/20 dark:bg-navy-900/40 border-b border-navy-100 dark:border-navy-800 text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
              <th className="p-3 pl-4">Poste / Rubrique</th>
              <th className="p-3 text-right">Brut N</th>
              <th className="p-3 text-right">Amort. N</th>
              <th className="p-3 text-right">Net N</th>
              <th className="p-3 text-right pr-4">Net N-1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-xs text-navy-700 dark:text-navy-300">
            {(lignes && Array.isArray(lignes) ? lignes : []).map((l, i) => {
              // Une ligne sans valeur d'amortissement ou de niveau 0 est considérée comme une masse de totalisation
              const estSomme = l.niveau === 0 || l.codeRubrique.startsWith('TOT');
              const aUnParent = l.niveau > 0;

              return (
                <tr key={i} className={`hover:bg-navy-50/10 dark:hover:bg-navy-800/10 ${estSomme ? 'font-black bg-navy-50/20 dark:bg-navy-900/20 text-navy-950 dark:text-white' : ''}`}>
                  {/* Indentation dynamique pilotée par la profondeur (l.niveau) de la BDD */}
                  <td className="p-3 uppercase text-[10.5px] tracking-wide" style={{ paddingLeft: `${(l.niveau * 16) + 16}px` }}>
                    {l.intitule}
                  </td>
                  <td className="p-3 text-right font-mono text-navy-900 dark:text-navy-50">{formatMontant(l.brutN || 0)}</td>
                  <td className="p-3 text-right font-mono text-navy-400 dark:text-navy-500">{formatMontant(l.amortissementN || 0)}</td>
                  <td className="p-3 text-right font-mono text-navy-900 dark:text-navy-50 font-bold">{formatMontant(l.netN || 0)}</td>
                  <td className="p-3 text-right font-mono text-navy-400 dark:text-navy-500 pr-4">{formatMontant(l.netN1 || 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
