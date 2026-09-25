import type { LigneFluxTresoDto } from '@/services/flux.service';
import React from 'react';

interface FluxTableProps {
  lignes: LigneFluxTresoDto[];
  formatMontant: (valeur: number) => string;
}

export const FluxTresorerieTable: React.FC<FluxTableProps> = ({ lignes, formatMontant }) => {
  return (
    <div className="border border-navy-100 dark:border-navy-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-navy-950 w-full font-sans">
      <div className="bg-navy-50/50 dark:bg-navy-900/40 p-3 border-b border-navy-100 dark:border-navy-800">
        <h3 className="text-xs font-bold text-navy-800 dark:text-navy-100 uppercase tracking-wider font-sans">
          🧮 Analyse des Flux Monétaires (Méthode Directe)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-navy-50/20 dark:bg-navy-900/10 border-b border-navy-100 dark:border-navy-800 text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
              <th className="p-3 pl-5">Libellé des flux de trésorerie</th>
              <th className="p-3 text-right w-[140px]">Exercice N</th>
              <th className="p-3 text-right w-[140px] pr-5">Exercice N-1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-navy-700 dark:text-navy-300">
            {lignes.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-10 text-navy-400 italic font-sans">
                  Aucune ligne configurée pour le Tableau des Flux de Trésorerie.
                </td>
              </tr>
            ) : (
              lignes.map((l, index) => {
                const isMasseMacro = l.niveau === 0;
                
                return (
                  <tr key={l.codeRubrique + index} className={`hover:bg-navy-50/10 dark:hover:bg-navy-800/10 transition-colors ${isMasseMacro ? 'bg-slate-100/60 dark:bg-navy-900/40 font-black text-navy-900 dark:text-navy-50 border-y border-navy-200 dark:border-navy-800' : ''}`}>
                    <td className="p-2.5 pl-5 font-sans" style={{ paddingLeft: `${20 + l.niveau * 16}px` }}>
                      <span className={isMasseMacro ? 'uppercase tracking-tight text-[11px] font-black' : 'font-medium'}>
                        {l.intitule}
                      </span>
                    </td>
                    {/* 💡 NETTOYAGE TYPOGRAPHIQUE : font-mono remplacé par font-sans antialiased sur toutes les données monétaires du TFT */}
                    <td className={`p-2.5 text-right font-sans antialiased ${isMasseMacro ? 'font-black text-navy-900 dark:text-navy-50 text-[12px]' : 'font-semibold text-slate-700 dark:text-navy-300'}`}>
                      {formatMontant(l.montantN)}
                    </td>
                    <td className={`p-2.5 text-right font-sans antialiased pr-5 ${isMasseMacro ? 'font-black text-navy-500' : 'font-medium text-navy-400 dark:text-navy-500'}`}>
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
