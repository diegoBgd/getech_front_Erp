import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { GrandLivreCompteBloc, GrandLivreParams } from '@/types/grandlivre.types';
import { exerciceService } from '@/services/exercice.service';
import { ecritureService } from '@/services/ecriture.service';
import { grandLivreService } from '@/services/grandlivre.service';
import { GrandLivreForm } from '@/components/forms/GrandLivreForm';


export const GrandLivrePage: React.FC = () => {
  const [exercices, setExercices] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [blocsComptes, setBlocsComptes] = useState<GrandLivreCompteBloc[]>([]);

  useEffect(() => {
    const initPage = async () => {
      try {
        const [resE, resC] = await Promise.all([
          exerciceService.getAll(),
          ecritureService.getComptesDetail()
        ]);
        setExercices(resE.map(e => ({ label: e.libelle, value: e.id })));
        setComptes(resC.map(c => ({ label: `${c.code} - ${c.intitule}`, value: c.code })));
      } catch (err) {
        console.error("Erreur d'initialisation du Grand Livre", err);
      } finally {
        setFetching(false);
      }
    };
    initPage();
  }, []);

  const handleFetchGrandLivre = async (idExercice: number, params: GrandLivreParams) => {
    setLoading(true);
    try {
      const data = await grandLivreService.getGrandLivre(idExercice, params);
      setBlocsComptes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatNombreMilliere = (val: number) => {
    if (val === undefined || val === null || val === 0) return '';
    return new Intl.NumberFormat('fr-BI', { maximumFractionDigits: 0 }).format(val);
  };

  const formaterDateFr = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  //  CORRECT (Alignement des variables de réduction accGrand et accBloc)
const grandTotalDebit = blocsComptes.reduce((accGrand, bloc) => {
  return accGrand + bloc.ecritures.reduce((accBloc, e) => accBloc + e.debit, 0);
}, 0);

const grandTotalCredit = blocsComptes.reduce((accGrand, bloc) => {
  return accGrand + bloc.ecritures.reduce((accBloc, e) => accBloc + e.credit, 0);
}, 0);


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Grand Livre des Comptes</h2>
          <p className="text-xs text-navy-400">Consultation réglementaire et édition des écritures</p>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {fetching ? (
          <div className="flex justify-center py-12"><ProgressSpinner style={{ width: '40px' }} /></div>
        ) : (
          <div className="flex flex-col gap-6">
            <GrandLivreForm exercices={exercices} comptes={comptes} loading={loading} onSubmit={handleFetchGrandLivre} />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <ProgressSpinner style={{ width: '40px' }} />
                <span className="text-xs text-navy-400">Génération du Grand Livre...</span>
              </div>
            ) : blocsComptes.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-navy-100 dark:border-navy-800 rounded-lg text-xs text-navy-400">
                Spécifiez l'exercice comptable et les plages pour afficher l'historique des écritures.
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {blocsComptes.map((bloc, idx) => {
                  const totalDebitPeriode = bloc.ecritures.reduce((sum, e) => sum + e.debit, 0);
                  const totalCreditPeriode = bloc.ecritures.reduce((sum, e) => sum + e.credit, 0);

                  return (
                    <div key={idx} className="w-full overflow-hidden border border-navy-900 dark:border-navy-700 bg-white dark:bg-navy-950">
                      <table className="w-full text-left border-collapse text-xs text-navy-900 dark:text-navy-100">
                        <thead>
                          <tr className="bg-white border-b border-navy-900 [&_th]:p-2 [&_th]:font-normal [&_th]:border-r [&_th]:border-navy-900 last:[&_th]:border-r-0">
                            <th style={{ width: '12%' }}>Date</th>
                            <th style={{ width: '10%' }}>Journal</th>
                            <th style={{ width: '15%' }}>N° pièce</th>
                            <th style={{ width: '13%' }}>Référence</th>
                            <th style={{ width: '30%' }}>Libellé</th>
                            <th style={{ width: '10%' }} className="text-left">Débit</th>
                            <th style={{ width: '10%' }} className="text-left">Crédit</th>
                          </tr>
                          <tr className="border-b border-navy-900 font-bold bg-white">
                            <td colSpan={7} className="p-2 px-3 tracking-wide">
                              <span className="font-tabular">{bloc.codeCompte} : {bloc.intituleCompte} </span>
                            </td>
                          </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-navy-900 [&_td]:p-2 [&_td]:px-3 [&_td]:border-r [&_td]:border-navy-900 last:[&_td]:border-r-0 bg-white">
                          {bloc.ecritures.map((e, eIdx) => (
                            <tr key={eIdx} className="hover:bg-navy-50/10">
                              <td className="font-tabular">{formaterDateFr(e.datePiece)}</td>
                              <td className="font-semibold uppercase tracking-wider">{e.codeJournal}</td>
                              <td className="font-tabular font-semibold">{e.numeroPiece}</td>
                              <td className="font-tabular">{e.reference || ''}</td>
                              <td className="uppercase">{e.libelleLigne}</td>
                              <td className="font-tabular text-right">{formatNombreMilliere(e.debit)}</td>
                              <td className="font-tabular text-right">{formatNombreMilliere(e.credit)}</td>
                            </tr>
                          ))}

                          <tr className="font-bold bg-white">
                            <td colSpan={5} className="p-2 px-3 text-navy-600">Total Compte</td>
                            <td className="font-tabular text-right border-l border-navy-900">{formatNombreMilliere(totalDebitPeriode) || '0'}</td>
                            <td className="font-tabular text-right border-l border-navy-900">{formatNombreMilliere(totalCreditPeriode) || '0'}</td>
                          </tr>

                          <tr className="font-bold bg-white">
                            <td colSpan={5} className="p-2 px-3 text-navy-600">Solde Compte</td>
                            <td className="font-tabular text-right border-l border-navy-900">
                              {bloc.soldeFinalDebiteur > 0 ? formatNombreMilliere(bloc.soldeFinalDebiteur) : ''}
                            </td>
                            <td className="font-tabular text-right border-l border-navy-900">
                              {bloc.soldeFinalCrediteur > 0 ? formatNombreMilliere(bloc.soldeFinalCrediteur) : ''}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })}

                {/* 💡 LIGNE DE TOTAL GÉNÉRAL COMPTABLE (En bas de toutes les grilles) */}
                <div className="w-full overflow-hidden border-2 border-navy-900 dark:border-navy-700 bg-navy-50/40 p-1 mt-2">
                  <table className="w-full text-left border-collapse text-xs font-bold text-navy-950">
                    <tbody>
                      <tr className="[&_td]:p-2.5 [&_td]:px-3">
                        <td style={{ width: '80%' }} className="text-left uppercase tracking-wider text-sm font-black">
                          TOTAL GÉNÉRAL DU GRAND LIVRE
                        </td>
                        <td style={{ width: '10%' }} className="font-tabular text-right text-sm border-l border-navy-900 bg-white">
                          {formatNombreMilliere(grandTotalDebit) || '0'}
                        </td>
                        <td style={{ width: '10%' }} className="font-tabular text-right text-sm border-l border-navy-900 bg-white">
                          {formatNombreMilliere(grandTotalCredit) || '0'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
