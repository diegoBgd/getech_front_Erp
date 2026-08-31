import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import type { Exercice } from '@/types/exercice.types';
import { historiqueService, type LigneHistoriqueCompteDto } from '@/services/historique.service';
import { exerciceService } from '@/services/exercice.service';
import { compteService } from '@/services/compte.service';
import { HistoriqueTable } from './HistoriqueTable';

export const HistoriqueComptePage: React.FC = () => {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [exerciceSelectionne, setExerciceSelectionne] = useState<number | null>(null);
  const [codeCompte, setCodeCompte] = useState<string>('');
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [lignes, setLignes] = useState<LigneHistoriqueCompteDto[]>([]);
  const [comptesOptions, setComptesOptions] = useState<{ label: string; value: string }[]>([]);

  const formatDate = (dateInput: any): string => {
  if (!dateInput) return '-';
  
  // Si Jackson envoie un tableau [AAAA, MM, DD]
  if (Array.isArray(dateInput)) {
    if (dateInput.length < 3) return '-';
    const annee = dateInput[0];
    const mois = String(dateInput[1]).padStart(2, '0');
    const jour = String(dateInput[2]).padStart(2, '0');
    return `${jour}/${mois}/${annee}`;
  }

  // Si c'est une chaîne ISO textuelle "2026-08-10"
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
      const [listEx, listComptes] = await Promise.all([
        exerciceService.getAll(),
        compteService.getAllComptes() // Doit renvoyer [{code, intitule}]
      ]);
      
      setExercices(listEx);
      setComptesOptions(listComptes.map(c => ({
        label: `${c.code} - ${c.intitule.toUpperCase()}`,
        value: c.code
      })));

      if (listEx && listEx.length > 0) {
        setExerciceSelectionne(listEx[0].id);
        setDateFin(listEx[0].dateFin);
      }
    } catch (err) {
      console.error("Erreur d'initialisation", err);
    }
  };

  const executerRecherche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciceSelectionne || !codeCompte) return;
    setLoading(true);
    try {
      const data = await historiqueService.getHistorique(exerciceSelectionne, codeCompte, dateDebut, dateFin);
      setLignes(data);
    } catch (err) {
      console.error(err);
      setLignes([]);
    } finally {
      setLoading(false);
    }
  };

  // 💡 TRAITEMENT DU TELECHARGEMENT DES EXPORTS EXCEL / PDF
  const handleExport = async (type: 'excel' | 'pdf') => {
    if (!exerciceSelectionne || !codeCompte) return;
    setExporting(true);
    try {
      const blob = type === 'excel' 
        ? await historiqueService.exporterExcel(exerciceSelectionne, codeCompte, dateDebut, dateFin)
        : await historiqueService.exporterPdf(exerciceSelectionne, codeCompte, dateDebut, dateFin);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Historique_Compte_${codeCompte}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Erreur d'export", err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => { initialiserPage(); }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Historique d'un Compte Général</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Consultation chronologique et suivi du solde glissant</p>
          </div>

          {/* 💡 BOUTONS D'EXPORTATION DISCRETS ET ELEGANTS */}
          {lignes.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')} disabled={exporting} className="text-xs font-bold uppercase h-[34px] border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <i className="pi pi-file-excel mr-1 text-xs"></i> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} disabled={exporting} className="text-xs font-bold uppercase h-[34px] border-rose-200 text-rose-700 hover:bg-rose-50">
                <i className="pi pi-file-pdf mr-1 text-xs"></i> PDF
              </Button>
            </div>
          )}
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        <form onSubmit={executerRecherche} className="flex flex-col gap-4 bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Exercice</label>
              <Select value={exerciceSelectionne} options={exercices.map(ex => ({ label: `${ex.libelle}`, value: ex.id }))} onChange={(e: any) => setExerciceSelectionne(e.value)} className="w-full text-xs" />
            </div>
            
            {/* 💡 CORRECTION : Remplacement de l'input par votre composant Select local pour le choix du compte */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Compte Général cible</label>
              <Select value={codeCompte} options={comptesOptions} onChange={(e: any) => setCodeCompte(e.value)} filter placeholder="Sélectionner le compte..." className="w-full text-xs font-bold font-mono" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Date Début</label>
              <Input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="w-full text-xs font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider">Date Fin</label>
              <Input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} className="w-full text-xs font-bold" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading || !codeCompte} variant="default" size="sm" className="w-full h-[38px] font-bold uppercase text-xs tracking-wider">
                {loading ? "Extraction des mouvements..." : "Générer l'historique"}
              </Button>
            </div>
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
