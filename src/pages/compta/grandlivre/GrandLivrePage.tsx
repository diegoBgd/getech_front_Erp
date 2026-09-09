import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { GrandLivreCompteBloc, GrandLivreParams } from '@/types/grandlivre.types';
import { ecritureService } from '@/services/ecriture.service';
import { grandLivreService } from '@/services/grandlivre.service';
import { GrandLivreForm } from '@/components/forms/GrandLivreForm';
import { GrandLivreTable } from './GrandLivreTable';
import { Button } from '@/components/ui/button';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';

export const GrandLivrePage: React.FC = () => {
  const [comptes, setComptes] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [blocsComptes, setBlocsComptes] = useState<GrandLivreCompteBloc[]>([]);
  const [filtres, setFiltres] = useState<GrandLivreParams>({
    dateDebut: '', dateFin: '', compteDebut: '', compteFin: ''
  });

  const { exerciceId } = useExerciceGlobal();

  useEffect(() => {
    (async () => {
      try {
        const resC = await ecritureService.getComptesDetail();
        setComptes(resC.map(c => ({ label: `${c.code} - ${c.intitule}`, value: c.code })));
      } catch (err) { 
        console.error(err); 
      } finally { 
        setFetching(false); 
      }
    })();
  }, []);

  const handleFetch = async (params: GrandLivreParams) => {
    if (!exerciceId) return;
    setFiltres(params); 
    setLoading(true);
    try { 
      setBlocsComptes(await grandLivreService.getGrandLivre(Number(exerciceId), params)); 
    } catch (err) { 
      console.error(err); 
      setBlocsComptes([]);
    } finally { 
      setLoading(false); 
    }
  };

  const handleDownload = async (type: 'excel' | 'pdf') => {
    if (!exerciceId) return;
    try {
      const blob = type === 'excel' 
        ? await grandLivreService.downloadExcel(Number(exerciceId), filtres) 
        : await grandLivreService.downloadPDF(Number(exerciceId), filtres);
      const link = document.createElement('a'); 
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `Grand_Livre.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link); 
      link.click(); 
      link.remove();
    } catch (err) { 
      console.error(err); 
    }
  };

  // 💡 DEBLOCAGE : L'effet de rafraîchissement automatique au changement d'exerciceId a été retiré !

  const fmtNum = (v: number) => (!v || v === 0) ? '' : new Intl.NumberFormat('fr-BI', { maximumFractionDigits: 0 }).format(v);
  const fmtDate = (str: string) => { if (!str) return ''; const [y, m, d] = str.split('-'); return `${d}/${m}/${y}`; };
  
  const gTotalD = blocsComptes.reduce((acc, b) => acc + (b.ecritures?.reduce((s, e) => s + e.debit, 0) || 0), 0);
  const gTotalC = blocsComptes.reduce((acc, b) => acc + (b.ecritures?.reduce((s, e) => s + e.credit, 0) || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-5 flex flex-col shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Grand Livre des Comptes</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Consultation réglementaire et édition filtrée pour la période active</p>
          </div>
          {blocsComptes.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleDownload('excel')} className="text-xs font-bold h-[34px] border-emerald-200 text-emerald-700 hover:bg-emerald-50"><i className="pi pi-file-excel text-xs mr-1"></i> Excel</Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')} className="text-xs font-bold uppercase h-[34px] border-rose-200 text-rose-700 hover:bg-rose-50"> <i className="pi pi-file-pdf mr-1 text-xs"></i> PDF</Button>
            </div>
          )}
        </div>
        <Divider className="my-4 border-navy-100 dark:border-navy-800" />
        {fetching ? <div className="flex justify-center py-12"><ProgressSpinner style={{ width: '40px' }} /></div> : (
          <div className="flex flex-col gap-4">
            <GrandLivreForm comptes={comptes} loading={loading} onSubmit={handleFetch} />
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2"><ProgressSpinner style={{ width: '40px' }} /><span className="text-xs text-navy-400 font-bold">Génération du rapport...</span></div>
            ) : blocsComptes.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-navy-200 dark:border-navy-800 rounded-xl text-xs text-navy-400 font-medium">Cliquez sur le bouton Charger pour extraire l'état du Grand Livre.</div>
            ) : (
              <GrandLivreTable blocs={blocsComptes} totalDebit={gTotalD} totalCredit={gTotalC} fmtNum={fmtNum} fmtDate={fmtDate} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
