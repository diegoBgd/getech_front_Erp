import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { resultatService, type ResultatResponseDto } from '@/services/resultat.service';
import { ResultatTable } from './ResultatTable';
import { useExerciceGlobal } from '@/contexts/ExerciceContext'; // 💡 Raccordement exercice global

export const CompteResultatPage: React.FC = () => {
  const { exerciceId } = useExerciceGlobal(); // 💡 Utilisation directe du contexte système
  const [loading, setLoading] = useState<boolean>(false);
  const [donnees, setDonnees] = useState<ResultatResponseDto | null>(null);
  
  // 💡 NAVIGATION PAR ONGLET : 'CHARGES' par défaut pour un affichage pleine largeur propre
  const [ongletActif, setOngletActif] = useState<'CHARGES' | 'PRODUITS'>('CHARGES');

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

  const executerCalculResultat = async () => {
    if (!exerciceId || !dateFin) return;
    setLoading(true);
    try {
      const data = await resultatService.extraireCompteResultat(Number(exerciceId), dateFin);
      setDonnees(data);
    } catch (err) {
      console.error("Erreur de calcul du compte de résultat", err);
      setDonnees(null);
    } finally {
      setLoading(false);
    }
  };

  // 💡 EFFET SYNC : Si l'exercice global change dans la TopBar, on recalcule immédiatement
  useEffect(() => {
    if (exerciceId) executerCalculResultat();
  }, [exerciceId]);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* EN-TÊTE CONFIGURATION SANS LISTE DÉROULANTE LOCAL D'EXERCICES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Compte de Résultat (SIG)</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Analyse de la performance économique arrêtée au : {dateFin ? formatDate(dateFin) : '-'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="w-[160px]">
              <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="text-xs font-bold h-[38px] w-full" />
            </div>
            <Button variant="default" size="sm" onClick={executerCalculResultat} disabled={loading || !exerciceId} className="font-bold uppercase text-xs h-[38px] px-4 shrink-0">
              <i className="pi pi-refresh mr-2 text-xs"></i> Calculer
            </Button>
          </div>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {/* CONTROLE DES ONGLETS IDENTIQUE AU FORMAT DE VOTRE BILAN */}
        <div className="flex border border-navy-100 dark:border-navy-800 p-1 rounded-xl bg-navy-50/30 dark:bg-navy-950/20 w-fit mb-4">
          <button 
            onClick={() => setOngletActif('CHARGES')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              ongletActif === 'CHARGES' ? 'bg-navy-900 text-white shadow-xs dark:bg-navy-800' : 'text-navy-500 hover:text-navy-800'
            }`}
          >
            📉 Compte de Charges (Classe 6)
          </button>
          <button 
            onClick={() => setOngletActif('PRODUITS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              ongletActif === 'PRODUITS' ? 'bg-navy-900 text-white shadow-xs dark:bg-navy-800' : 'text-navy-500 hover:text-navy-800'
            }`}
          >
            📈 Compte de Produits (Classe 7)
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 bg-navy-50/10 dark:bg-navy-900/10 rounded-xl w-full">
            <ProgressSpinner style={{ width: '32px' }} />
            <span className="text-[11px] text-navy-400 font-bold font-mono">Calcul des soldes intermédiaires de gestion...</span>
          </div>
        ) : donnees && (
          <div className="w-full">
            {/* 💡 AFFICHAGE COMPACT PLEINE LARGEUR SELON L'ONGLET SÉLECTIONNÉ */}
            {ongletActif === 'CHARGES' ? (
              <ResultatTable titre="Compte de Charges (Classes 6)" lignes={donnees.charges || []} formatMontant={formatMontant} />
            ) : (
              <ResultatTable titre="Compte de Produits (Classes 7)" lignes={donnees.produits || []} formatMontant={formatMontant} />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
