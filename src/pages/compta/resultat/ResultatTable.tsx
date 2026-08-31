import type { LigneResultatDto } from '@/services/resultat.service';
import React from 'react';


interface ResultatTableProps {
  titre: string;
  lignes: LigneResultatDto[];
  formatMontant: (valeur: number) => string;
}

export const ResultatTable: React.FC<ResultatTableProps> = ({ titre, lignes, formatMontant }) => {
  return (
    <div className="border border-navy-100 dark:border-navy-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-navy-950 flex-1">
      <div className="bg-navy-50/50 dark:bg-navy-900/40 p-3 border-b border-navy-100 dark:border-navy-800">
        <h3 className="text-xs font-bold text-navy-800 dark:text-navy-100 uppercase tracking-wider">
          {titre}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/20 dark:bg-navy-900/10 border-b border-navy-100 dark:border-navy-800 text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
              <th className="p-2.5 pl-4">Rubrique</th>
              <th className="p-2.5 text-right w-[120px]">Exercice N</th>
              <th className="p-2.5 text-right w-[120px]">Exercice N-1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-xs text-navy-700 dark:text-navy-300">
            {lignes.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-8 text-navy-400 italic">Aucune donnée sur cette masse.</td>
              </tr>
            ) : (
              lignes.map((l, index) => {
                // Si la ligne suivante a un niveau inférieur, ou si c'est la dernière ligne à niveau 0, c'est un total
                const estTotal = l.niveau === 0 || (index < lignes.length - 1 && lignes[index + 1].niveau < l.niveau);
                
                return (
                  <tr 
                    key={l.codeRubrique + index} 
                    className={`hover:bg-navy-50/10 dark:hover:bg-navy-800/10 ${
                      estTotal ? 'bg-navy-50/30 dark:bg-navy-900/30 font-bold text-navy-900 dark:text-navy-50' : ''
                    }`}
                  >
                    <td className="p-2.5 pl-4" style={{ paddingLeft: `${16 + l.niveau * 12}px` }}>
                      <span className={estTotal ? 'uppercase tracking-tight text-[11px]' : 'font-medium'}>
                        {l.intitule}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-semibold">
                      {formatMontant(l.montantN)}
                    </td>
                    <td className="p-2.5 text-right font-mono text-navy-500">
                      {formatMontant(l.montantN1)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
