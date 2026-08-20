import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import type { Exercice } from '@/types/exercice.types';
import { resultatService, type ResultatResponseDto } from '@/services/resultat.service';
import { exerciceService } from '@/services/exercice.service';
import { ResultatTable } from './ResultatTable';


export const CompteResultatPage: React.FC = () => {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [exerciceSelectionne, setExerciceSelectionne] = useState<number | null>(null);
  const [dateFin, setDateFin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [donnees, setDonnees] = useState<ResultatResponseDto | null>(null);

  //  Formatage uniforme imposé DD/MM/YYYY
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const parties = dateStr.split('-');
    if (parties.length !== 3) return dateStr;
    return `${parties[2]}/${parties[1]}/${parties[0]}`;
  };

  const formatMontant = (valeur: number) => {
    if (valeur === 0 || !valeur) return '-';
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(valeur);
  };

  const chargerExercices = async () => {
    try {
      const liste = await exerciceService.getAll();
      setExercices(liste);
      if (liste && liste.length > 0) {
        setExerciceSelectionne(liste[0].id);
        setDateFin(liste[0].dateFin);
      }
    } catch (err) {
      console.error("Erreur de chargement des exercices", err);
    }
  };

  const executerCalculResultat = async () => {
    if (!exerciceSelectionne || !dateFin) return;
    setLoading(true);
    try {
      const data = await resultatService.extraireCompteResultat(exerciceSelectionne, dateFin);
      setDonnees(data);
    } catch (err) {
      console.error("Erreur de calcul du compte de résultat", err);
      setDonnees(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { chargerExercices(); }, []);

  useEffect(() => {
    if (exerciceSelectionne) {
      const exInfo = exercices.find(e => e.id === exerciceSelectionne);
      if (exInfo) setDateFin(exInfo.dateFin);
      executerCalculResultat();
    }
  }, [exerciceSelectionne]);

  const optionsExercices = exercices.map(ex => ({
    label: `${ex.libelle} [${ex.code}]`,
    value: ex.id
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">
              Compte de Résultat (SIG)
            </h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              Analyse de la performance économique arrêtée au : {dateFin ? formatDate(dateFin) : '-'}
            </p>
          </div>

          {/* SÉLECTEURS DE PILOTAGE */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[240px]">
              <Select 
                value={exerciceSelectionne} 
                options={optionsExercices} 
                onChange={(e: any) => setExerciceSelectionne(e.value)}
                placeholder="Sélectionner l'exercice"
                className="text-xs font-bold"
              />
            </div>
            <div className="w-[150px]">
              <Input 
                type="date" 
                value={dateFin} 
                onChange={(e) => setDateFin(e.target.value)}
                className="text-xs font-bold h-[38px]"
              />
            </div>
            <Button 
              variant="default" 
              size="sm" 
              onClick={executerCalculResultat} 
              disabled={loading || !exerciceSelectionne}
              className="font-bold uppercase text-xs h-[38px] px-4"
            >
              <i className="pi pi-refresh mr-2 text-xs"></i> Calculer
            </Button>
          </div>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {loading && (
          <div className="flex flex-col items-center justify-center py-6 gap-2 bg-navy-50/10 dark:bg-navy-900/10 rounded-xl mb-4">
            <ProgressSpinner style={{ width: '28px' }} />
            <span className="text-[11px] text-navy-400">Calcul des soldes intermédiaires de gestion...</span>
          </div>
        )}

        {/* AFFICHAGE DES DEUX MASSES DE L'ACTIVITÉ */}
        <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
          <ResultatTable 
            titre=" Compte de Charges (Classes 6)" 
            lignes={donnees?.charges || []} 
            formatMontant={formatMontant} 
          />
          <ResultatTable 
            titre=" Compte de Produits (Classes 7)" 
            lignes={donnees?.produits || []} 
            formatMontant={formatMontant} 
          />
        </div>

      </div>
    </div>
  );
};
