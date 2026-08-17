import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { GrandLivreCompteBloc, GrandLivreParams } from '@/types/grandlivre.types';
import { exerciceService } from '@/services/exercice.service';
import { ecritureService } from '@/services/ecriture.service';
import { grandLivreService } from '@/services/grandlivre.service';
import { GrandLivreForm } from '@/components/forms/GrandLivreForm';
import { GrandLivreTable } from './GrandLivreTable';
import { Button } from '@/components/ui/button';


export const GrandLivrePage: React.FC = () => {
  const [exercices, setExercices] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [blocsComptes, setBlocsComptes] = useState<GrandLivreCompteBloc[]>([]);
  const [idExercice, setIdExercice] = useState<number | null>(null);
  const [filtres, setFiltres] = useState<GrandLivreParams>({
    dateDebut: '', dateFin: '', compteDebut: '', compteFin: ''
  });

  useEffect(() => {
    (async () => {
      try {
        const [resE, resC] = await Promise.all([exerciceService.getAll(), ecritureService.getComptesDetail()]);
        setExercices(resE.map(e => ({ label: e.libelle, value: e.id })));
        setComptes(resC.map(c => ({ label: `${c.code} - ${c.intitule}`, value: c.code })));
        if (resE.length > 0) setIdExercice(resE[0].id);
      } catch (err) { console.error(err); } finally { setFetching(false); }
    })();
  }, []);

  const handleFetch = async (exId: number, params: GrandLivreParams) => {
    setIdExercice(exId); setFiltres(params); setLoading(true);
    try { setBlocsComptes(await grandLivreService.getGrandLivre(exId, params)); } 
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDownload = async (type: 'excel' | 'pdf') => {
    if (!idExercice) return;
    try {
      const blob = type === 'excel' ? await grandLivreService.downloadExcel(idExercice, filtres) : await grandLivreService.downloadPDF(idExercice, filtres);
      const link = document.createElement('a'); link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `Grand_Livre.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link); link.click(); link.remove();
    } catch (err) { console.error(err); }
  };

  const fmtNum = (v: number) => (!v || v === 0) ? '' : new Intl.NumberFormat('fr-BI', { maximumFractionDigits: 0 }).format(v);
  const fmtDate = (str: string) => { if (!str) return ''; const [y, m, d] = str.split('-'); return `${d}/${m}/${y}`; };
  const gTotalD = blocsComptes.reduce((acc, b) => acc + b.ecritures.reduce((s, e) => s + e.debit, 0), 0);
  const gTotalC = blocsComptes.reduce((acc, b) => acc + b.ecritures.reduce((s, e) => s + e.credit, 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl border border-navy-100 p-5 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900">Grand Livre des Comptes</h2>
            <p className="text-xs text-navy-400">Consultation réglementaire et édition</p>
          </div>
          {blocsComptes.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleDownload('excel')}><i className="pi pi-file-excel text-xs mr-1 text-emerald-600"></i> Excel</Button>
              <Button variant="default" size="sm" onClick={() => handleDownload('pdf')}><i className="pi pi-file-pdf text-xs mr-1"></i> PDF</Button>
            </div>
          )}
        </div>
        <Divider className="my-4" />
        {fetching ? <div className="flex justify-center py-12"><ProgressSpinner style={{ width: '40px' }} /></div> : (
          <div className="flex flex-col gap-6">
            <GrandLivreForm exercices={exercices} comptes={comptes} loading={loading} onSubmit={handleFetch} />
            {loading ? <div className="flex flex-col items-center justify-center py-16 gap-2"><ProgressSpinner style={{ width: '40px' }} /><span className="text-xs text-navy-400">Génération...</span></div> : 
             blocsComptes.length === 0 ? <div className="text-center p-8 border border-dashed border-navy-100 text-xs text-navy-400">Spécifiez l'exercice pour afficher le rapport.</div> : (
              <GrandLivreTable blocs={blocsComptes} totalDebit={gTotalD} totalCredit={gTotalC} fmtNum={fmtNum} fmtDate={fmtDate} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
