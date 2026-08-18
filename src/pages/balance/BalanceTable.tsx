import React from 'react';

interface TableProps {
  lignes: any[];
  typeCols: string; // '4' ou '6'
  fmt: (v: number) => string;
}

export const BalanceTable: React.FC<TableProps> = ({ lignes, typeCols, fmt }) => {
  
  // RÈGLE COMPTABLE : Les totaux généraux se calculent exclusivement sur les comptes terminaux (détails)
  // pour éviter de doubler ou tripler les montants avec les lignes collectives parentes.
  const comptesDetails = lignes.filter(l => l.codeCompte.length >= 4 || !lignes.some(sub => sub.codeCompte.startsWith(l.codeCompte) && sub.codeCompte !== l.codeCompte));

  const sumInitD = comptesDetails.reduce((s, l) => s + (l.soldeInitialDebiteur || 0), 0);
  const sumInitC = comptesDetails.reduce((s, l) => s + (l.soldeInitialCrediteur || 0), 0);
  const sumMouvD = comptesDetails.reduce((s, l) => s + (l.cumulDebitPeriode || 0), 0);
  const sumMouvC = comptesDetails.reduce((s, l) => s + (l.cumulCreditPeriode || 0), 0);
  const sumFinD = comptesDetails.reduce((s, l) => s + (l.soldeFinalDebiteur || 0), 0);
  const sumFinC = comptesDetails.reduce((s, l) => s + (l.soldeFinalCrediteur || 0), 0);

  return (
    <div className="w-full overflow-hidden border border-navy-900 bg-white shadow-xs rounded-sm animate-fade-in">
      <table className="w-full text-left border-collapse text-xs text-navy-900">
        <thead>
          <tr className="bg-navy-50/40 border-b border-navy-900 text-center font-bold [&_td]:p-2 [&_td]:border-r [&_td]:border-navy-900">
            <td colSpan={2} rowSpan={2} className="align-middle bg-navy-50/60">Structure Plan Comptable</td>
            {typeCols === '6' && <td colSpan={2} className="bg-navy-50/20">1. Soldes Initiaux</td>}
            <td colSpan={2} className="bg-navy-50/20">2. Mouvements Période</td>
            <td colSpan={2} className="bg-navy-50/20">3. Soldes Finaux</td>
          </tr>
          <tr className="bg-white border-b border-navy-900 font-bold text-center [&_td]:p-2 [&_td]:border-r [&_td]:border-navy-900 last:[&_td]:border-r-0">
            {typeCols === '6' && <><td>Débit</td><td>Crédit</td></>}
            <td>Débit</td><td>Crédit</td>
            <td>Débit</td><td>Crédit</td>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-200 bg-white [&_td]:p-2 [&_td]:px-3 [&_td]:border-r [&_td]:border-navy-900 last:[&_td]:border-r-0">
          {lignes.map((l, idx) => {
            // Détection structurelle pour le look des lignes collectives (longueur courte)
            const isCollectif = l.codeCompte.length < 4;

            return (
              <tr 
                key={idx} 
                className={`transition-colors ${
                  isCollectif 
                    ? 'bg-navy-50/30 font-bold text-navy-950 dark:bg-navy-900/20' 
                    : 'hover:bg-navy-50/10'
                }`}
              >
                <td className={`font-tabular font-bold w-[12%] ${isCollectif ? 'tracking-wide' : 'pl-6 text-navy-600'}`}>
                  {l.codeCompte}
                </td>
                <td className={`uppercase w-[34%] ${isCollectif ? 'font-black' : 'text-navy-700'}`}>
                  {isCollectif ? l.intituleCompte : l.intituleCompte}
                </td>
                {typeCols === '6' && <>
                  <td className={`font-tabular text-right w-[9%] ${isCollectif ? 'text-navy-950' : 'text-navy-400'}`}>{fmt(l.soldeInitialDebiteur)}</td>
                  <td className={`font-tabular text-right w-[9%] ${isCollectif ? 'text-navy-950' : 'text-navy-400'}`}>{fmt(l.soldeInitialCrediteur)}</td>
                </>}
                <td className="font-tabular text-right w-[9%]">{fmt(l.cumulDebitPeriode)}</td>
                <td className="font-tabular text-right w-[9%]">{fmt(l.cumulCreditPeriode)}</td>
                <td className="font-tabular text-right w-[9%] font-bold text-navy-950">{fmt(l.soldeFinalDebiteur)}</td>
                <td className="font-tabular text-right w-[9%] font-bold text-navy-950">{fmt(l.soldeFinalCrediteur)}</td>
              </tr>
            );
          })}
          
          {/* LIGNE DES TOTALISATIONS COMPTABLES ACCRÉDITÉES */}
          <tr className="font-black bg-navy-950 text-white border-t-2 border-navy-900 [&_td]:p-2.5">
            <td colSpan={2} className="uppercase tracking-wider">TOTAL GÉNÉRAL DU SYSTÈME</td>
            {typeCols === '6' && <>
              <td className="font-tabular text-right border-l border-navy-800">{fmt(sumInitD) || '0'}</td>
              <td className="font-tabular text-right border-l border-navy-800">{fmt(sumInitC) || '0'}</td>
            </>}
            <td className="font-tabular text-right border-l border-navy-800">{fmt(sumMouvD) || '0'}</td>
            <td className="font-tabular text-right border-l border-navy-800">{fmt(sumMouvC) || '0'}</td>
            <td className="font-tabular text-right border-l border-navy-800 text-emerald-400">{fmt(sumFinD) || '0'}</td>
            <td className="font-tabular text-right border-l border-navy-800 text-rose-400">{fmt(sumFinC) || '0'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
