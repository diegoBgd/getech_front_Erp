import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';

import { bilanService, type BilanCompletResponseDto } from '@/services/bilan.service';
import { BilanActifTable } from './BilanActifTable';
import { BilanPassifTable } from './BilanPassifTable';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const BilanPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [donnees, setDonnees] = useState<BilanCompletResponseDto | null>(null);
  
  // 💡 NAVIGATION PAR ONGLET : 'ACTIF' par défaut pour maximiser l'espace d'affichage
  const [ongletActif, setOngletActif] = useState<'ACTIF' | 'PASSIF'>('ACTIF');

  const anneeCourante = new Date().getFullYear();
  const [dateFin, setDateFin] = useState<string>(`${anneeCourante}-12-31`);

  const { exerciceId } = useExerciceGlobal();

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

  const executerCalculBilan = async () => {
  if (!exerciceId || !dateFin) return;
  setLoading(true);
  try {
    // 💡 FORCE LE PASSAGE EN TYPE NUMBER EXIGÉ PAR LE NOUVEAU CONTRAT AXIOS
    const data = await bilanService.extraireBilan(Number(exerciceId), dateFin);
    setDonnees(data);
  } catch (err) {
    console.error("Erreur d'extraction du bilan", err);
    setDonnees(null);
  } finally {
    setLoading(false);
  }
};

  // 💡 SÉCURISATION DES EXPORTS : Appels réseau natifs vers votre contrôleur d'état
  const handleExportationBilan = async (type: 'excel' | 'pdf') => {
    if (!exerciceId || !dateFin) return;
    try {
      const blob = type === 'excel'
        ? await bilanService.downloadExcel(Number(exerciceId), dateFin)
        : await bilanService.downloadPDF(Number(exerciceId), dateFin);
            
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bilan_Comptable_${dateFin}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click(); 
      link.remove();
    } catch (err) {
      console.error("Erreur lors du téléchargement de l'édition du bilan", err);
    }
  };

  useEffect(() => {
    if (exerciceId) executerCalculBilan();
  }, [exerciceId]);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* EN-TÊTE DE PAGE AVEC BOUTONS D'EXPORTATION RÉGLEMENTAIRES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Bilan Comptable Réglementaire</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Situation patrimoniale arrêtée au : {dateFin ? formatDate(dateFin) : '-'}</p>
          </div>

          {donnees && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleExportationBilan('excel')} className="text-xs font-bold  h-[34px] border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <i className="pi pi-file-excel text-xs mr-1.5"></i> Excel
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleExportationBilan('pdf')} className="text-xs font-bold uppercase h-[34px] border-rose-200 text-rose-700 hover:bg-rose-50">
                <i className="pi pi-file-pdf text-xs mr-1.5"></i> PDF
              </Button>
            </div>
          )}
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {/* COMMANDE FILTRE ET SÉLECTEUR DE VUE DOUBLE-FACE */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          {/* COMMANDE PAR ONGLET (Pliage de l'espace de lecture) */}
          <div className="flex border border-navy-100 dark:border-navy-800 p-1 rounded-xl bg-navy-50/30 dark:bg-navy-950/20 shrink-0">
            <button 
              onClick={() => setOngletActif('ACTIF')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                ongletActif === 'ACTIF' ? 'bg-navy-900 text-white shadow-xs dark:bg-navy-800' : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              💼 Actif Patrimonial
            </button>
            <button 
              onClick={() => setOngletActif('PASSIF')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                ongletActif === 'PASSIF' ? 'bg-navy-900 text-white shadow-xs dark:bg-navy-800' : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              ⚖️ Passif & Capitaux Propres
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="w-[160px]">
              <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="text-xs font-bold h-[30px] w-full" />
            </div>
            <Button variant="default" size="sm" onClick={executerCalculBilan} disabled={loading || !exerciceId} className="font-bold uppercase text-xs h-[30px] px-4 shrink-0">
              <i className="pi pi-refresh mr-2 text-xs"></i> Calculer
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 bg-navy-50/10 dark:bg-navy-900/10 rounded-xl">
            <ProgressSpinner style={{ width: '32px' }} />
            <span className="text-xs text-navy-400 font-bold font-mono">Consolidation récursive des masses de la balance...</span>
          </div>
        ) : donnees && (
          <div className="w-full">
            {/* 💡 SÉLECTION CHIRURGICALE DE LA MASSE PATRIMONIALE SUR 100% DE LARGEUR */}
            {ongletActif === 'ACTIF' ? (
              <BilanActifTable lignes={donnees.actif || []} formatMontant={formatMontant} formatDate={formatDate} />
            ) : (
              <BilanPassifTable lignes={donnees.passif || []} formatMontant={formatMontant} formatDate={formatDate} />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
