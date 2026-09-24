import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { fluxTresorerieService, type LigneFluxTresoDto } from '@/services/flux.service';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';
import { FluxTresorerieTable } from './FluxTresorerieTable';

export const FluxTresoreriePage: React.FC = () => {
  const { exerciceId } = useExerciceGlobal(); // 💡 Écoute synchronisée globale
  const [loading, setLoading] = useState<boolean>(false);
  const [lignes, setLignes] = useState<LigneFluxTresoDto[]>([]);

  const anneeCourante = new Date().getFullYear();
  const [dateFin, setDateFin] = useState<string>(`${anneeCourante}-12-31`);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const parties = dateStr.split('-');
    if (parties.length !== 3) return dateStr;
    return `${parties[2]}/${parties[1]}/${parties[0]}`;
  };

  const formatMontant = (valeur: number) => {
    if (valeur === 0 || !valeur) return '-';
    return new Intl.NumberFormat('fr-BI', { maximumFractionDigits: 0 }).format(valeur);
  };

  const executerCalculFlux = async () => {
    if (!exerciceId || !dateFin) return;
    setLoading(true);
    try {
      const res = await fluxTresorerieService.extraireFlux(Number(exerciceId), dateFin);
      setLignes(res.lignes || []);
    } catch (err) {
      console.error("Erreur d'extraction du TFT", err);
      setLignes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exerciceId) executerCalculFlux();
  }, [exerciceId]);

  // 💡 GESTION DU TELECHARGEMENT SECURISE SANS CORRUPTION BINAIRE
  const declencherExport = async (format: 'EXCEL' | 'PDF') => {
    if (!exerciceId || !dateFin) return;
    try {
      const blob = format === 'EXCEL' 
        ? await fluxTresorerieService.telechargerExcel(Number(exerciceId), dateFin)
        : await fluxTresorerieService.telechargerPDF(Number(exerciceId), dateFin);
        
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TFT_${dateFin}.${format === 'EXCEL' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Erreur d'exportation ${format}`, err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* EN-TÊTE ET ACTIONS DE PILOTAGE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">
              Tableau des Flux de Trésorerie (TFT)
            </h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              Mouvements de liquidités arrêtés au : {dateFin ? formatDate(dateFin) : '-'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="w-[150px]">
              <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="text-xs font-bold  w-full" />
            </div>
            <Button variant="default" size="sm" onClick={executerCalculFlux} disabled={loading || !exerciceId} className="font-bold uppercase text-xs h-[30px] px-3 shrink-0">
              <i className="pi pi-refresh text-xs mr-1"></i> Calculer
            </Button>
            <Button variant="outline" size="sm" onClick={() => declencherExport('EXCEL')} disabled={loading || lignes.length === 0} className="font-bold uppercase text-xs h-[30px] px-3 shrink-0 border-navy-200 dark:border-navy-700 text-emerald-600 hover:bg-emerald-50/30">
              <i className="pi pi-file-excel text-xs mr-1"></i> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => declencherExport('PDF')} disabled={loading || lignes.length === 0} className="font-bold uppercase text-xs h-[30px] px-3 shrink-0 border-navy-200 dark:border-navy-700 text-rose-600 hover:bg-rose-50/30">
              <i className="pi pi-file-pdf text-xs mr-1"></i> PDF
            </Button>
          </div>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 bg-navy-50/10 dark:bg-navy-900/10 rounded-xl w-full">
            <ProgressSpinner style={{ width: '32px' }} />
            <span className="text-[11px] text-navy-400 font-bold font-mono">Scan de la balance monétaire et sommation des flux...</span>
          </div>
        ) : (
          <div className="w-full">
            <FluxTresorerieTable lignes={lignes} formatMontant={formatMontant} />
          </div>
        )}

      </div>
    </div>
  );
};
