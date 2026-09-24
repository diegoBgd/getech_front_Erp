import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { historiqueService, type LigneHistoriqueCompteDto } from '@/services/historique.service';
import { compteService } from '@/services/compte.service';
import { HistoriqueTable } from './HistoriqueTable';
import { useExerciceGlobal } from '@/contexts/ExerciceContext'; // 💡 IMPORT DU CONTEXTE GLOBAL

export const HistoriqueComptePage: React.FC = () => {
  const [codeCompte, setCodeCompte] = useState<string>('');
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [lignes, setLignes] = useState<LigneHistoriqueCompteDto[]>([]);
  const [comptesOptions, setComptesOptions] = useState<{ label: string; value: string }[]>([]);

  // 💡 DEPLOCAGE ET CONSOMMATION DE L'EXERCICE GLOBAL DE LA TOPBAR
  const { exerciceId } = useExerciceGlobal();

  const formatDate = (dateInput: any): string => {
    if (!dateInput) return '-';
    if (Array.isArray(dateInput)) {
      if (dateInput.length < 3) return '-';
      const annee = dateInput[0];
      const mois = String(dateInput[1]).padStart(2, '0');
      const jour = String(dateInput[2]).padStart(2, '0');
      return `${jour}/${mois}/${annee}`;
    }
    if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const parties = dateInput.split('-');
      if (parties.length === 3) {
        return `${parties[2].substring(0, 2)}/${parties[1]}/${parties[0]}`;
      }
    }
    return String(dateInput);
  };

  const formatMontant = (valeur: number) => {
    if (valeur === 0 || !valeur) return '-';
    return new Intl.NumberFormat('fr-BI', { minimumFractionDigits: 0 }).format(valeur);
  };

  const initialiserPage = async () => {
    try {
      const listComptes = await compteService.getComptesDetail();
      setComptesOptions(listComptes.map(c => ({
        label: `${c.code} - ${c.intitule.toUpperCase()}`,
        value: c.code
      })));
    } catch (err) {
      console.error("Erreur d'initialisation du plan comptable", err);
    }
  };

  const executerRecherche = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!exerciceId || !codeCompte) return;
    setLoading(true);
    try {
      const data = await historiqueService.getHistorique(Number(exerciceId), codeCompte, dateDebut, dateFin);
      setLignes(data);
    } catch (err) {
      console.error(err);
      setLignes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'excel' | 'pdf') => {
    if (!exerciceId || !codeCompte) return;
    setExporting(true);
    try {
      const blob = type === 'excel' 
        ? await historiqueService.exporterExcel(Number(exerciceId), codeCompte, dateDebut, dateFin)
        : await historiqueService.exporterPdf(Number(exerciceId), codeCompte, dateDebut, dateFin);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Historique_Compte_${codeCompte}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Erreur lors du téléchargement de l'extrait", err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => { 
    initialiserPage(); 
  }, []);

  // 💡 EFFET RELANCE AUTOMATIQUE : Re-déclenche l'extraction si l'utilisateur change d'exercice dans la TopBar
  useEffect(() => {
    if (exerciceId && codeCompte) {
      executerRecherche();
    }
  }, [exerciceId]);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Historique d'un Compte Général</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Consultation chronologique et suivi du solde glissant de la période</p>
          </div>

          {lignes.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')} disabled={exporting} className="text-xs font-bold   h-[34px] border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <i className="pi pi-file-excel mr-1 text-xs"></i> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} disabled={exporting} className="text-xs font-bold   h-[34px] border-rose-200 text-rose-700 hover:bg-rose-50">
                <i className="pi pi-file-pdf mr-1 text-xs"></i> PDF
              </Button>
            </div>
          )}
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {/* 💡 FILTRE ÉPURÉ ET COMPACTÉ SUR UNE SEULE LIGNE HORIZONTALE */}
        <form onSubmit={executerRecherche} className="grid grid-cols-1 md:grid-cols-[45%_15%_15%_20%] gap-4 bg-navy-50/30 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Compte cible</label>
            <Select value={codeCompte} options={comptesOptions} onChange={(e: any) => setCodeCompte(e.value)} filter placeholder="Sélectionner un compte" className="w-full text-xs font-bold font-mono " />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Du (Date Début)</label>
            <Input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="w-full text-xs font-bold "/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Au (Date Fin)</label>
            <Input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} className="w-full text-xs font-bold " />
          </div>

          <div className="flex flex-col justify-end">
            <Button type="submit" disabled={loading || !codeCompte || !exerciceId} variant="default" size="sm" className="w-full h-[30px] font-bold  text-xs tracking-wider shadow-xs">
              {loading ? <><i className="pi pi-spin pi-spinner mr-2"></i> Extraction...</> : <><i className="pi pi-search mr-2"></i> Extraire l'historique</>}
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-16"><ProgressSpinner style={{ width: '36px' }} /></div>
        ) : (
          <HistoriqueTable lignes={lignes} formatDate={formatDate} formatMontant={formatMontant} />
        )}

      </div>
    </div>
  );
};
