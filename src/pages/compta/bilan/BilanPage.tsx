import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { bilanService, type BilanCompletResponseDto } from '@/services/bilan.service';

import { BilanPassifTable } from './BilanPassifTable';
import { useExerciceGlobal } from '@/contexts/ExerciceContext'; // 💡 IMPORT DU CONTEXTE GLOBAL
import { BilanActifTable } from './BilanActifTable';

export const BilanPage: React.FC = () => {
  const [dateFin, setDateFin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [donnees, setDonnees] = useState<BilanCompletResponseDto | null>(null);

  // 💡 LIAISON COMPTABLE COMMUNE : Récupère la période active de la TopBar
  const { exerciceId, exercicesOptions } = useExerciceGlobal();

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const parties = dateStr.split('-');
    if (parties.length !== 3) return dateStr;
    return `${parties[2]}/${parties[1]}/${parties[0]}`;
  };

  const formatMontant = (valeur: number) => {
    if (valeur === 0 || !valeur) return '-';
    return new Intl.NumberFormat('fr-BI', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(valeur);
  };

  const executerCalculBilan = async () => {
    if (!exerciceId || !dateFin) return;
    setLoading(true);
    try {
      const data = await bilanService.extraireBilan(Number(exerciceId), dateFin);
      setDonnees(data);
    } catch (err) {
      console.error("Erreur de calcul du bilan récursif", err);
      setDonnees(null);
    } finally {
      setLoading(false);
    }
  };

  // 💡 EFFET DE RECONSTITUTION DE LA DATE DE FIN SELON L'EXERCICE GLOBAL SÉLECTIONNÉ
  useEffect(() => {
    if (exerciceId && exercicesOptions.length > 0) {
      const exCourant = exercicesOptions.find(e => e.value === exerciceId);
      if (exCourant) {
        // Extrait le code de l'exercice ou cale la date par défaut (ex: 31 décembre de l'année)
        const matchAnnee = exCourant.label.match(/\d{4}/);
        const annee = matchAnnee ? matchAnnee[0] : new Date().getFullYear().toString();
        setDateFin(`${annee}-12-31`);
      }
    }
  }, [exerciceId, exercicesOptions]);

  // 💡 RELANCE COMPTABLE COMMUNE : Recalcule automatiquement dès que la période change ou que la date butoir est ajustée
  useEffect(() => {
    if (exerciceId && dateFin) {
      executerCalculBilan();
    }
  }, [exerciceId, dateFin]);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">

        {/* EN-TÊTE DE PAGE AVEC FILTRES COMPACTÉS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Bilan Comptable Réglementaire</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Période arrêtée au : {dateFin ? formatDate(dateFin) : '-'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[160px]">
              <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="text-xs font-bold " />
            </div>
            <Button variant="default" size="sm" onClick={executerCalculBilan} disabled={loading || !exerciceId} className="font-bold  text-xs h-[30px] px-4">
              <i className="pi pi-file-edit mr-2 text-xs"></i> Afficher
            </Button>
          </div>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {loading && (
          <div className="flex flex-col items-center justify-center py-6 gap-2 bg-navy-50/10 dark:bg-navy-900/10 rounded-xl mb-4">
            <ProgressSpinner style={{ width: '28px' }} />
            <span className="text-[11px] text-navy-400">Interrogation récursive de la balance...</span>
          </div>
        )}

        {/* AFFICHAGE DES DEUX MASSES PATRIMONIALES (ACTIF / PASSIF) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <BilanActifTable
            lignes={(donnees?.actif || []) as any[]}
            formatMontant={formatMontant}
            formatDate={formatDate}
          />
          <BilanPassifTable lignes={donnees?.passif || []} formatMontant={formatMontant} formatDate={formatDate} />
        </div>

      </div>
    </div>
  );
};
