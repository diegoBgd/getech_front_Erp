import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { balanceService } from '@/services/balance.service';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BalanceTable } from './BalanceTable';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';

export const BalancePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [lignes, setLignes] = useState<any[]>([]);
  
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  const [typeBalance, setTypeBalance] = useState<string>('6'); 
  const [structureComptable, setStructureComptable] = useState<string>('true');

  const { exerciceId } = useExerciceGlobal();

  const executerCalculBalance = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!exerciceId) return;
    
    setLoading(true);
    try {
      const data = await balanceService.getBalance(Number(exerciceId), { 
        dateDebut: dateDebut || undefined, 
        dateFin: dateFin || undefined, 
        typeBalance,
        centralisee: structureComptable === 'true'
      });
      setLignes(data);
    } catch (err) {
      console.error(err);
      setLignes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (type: 'excel' | 'pdf') => {
    if (!exerciceId) return;
    try {
      const params = { dateDebut, dateFin, typeBalance, centralisee: structureComptable === 'true' };
      const blob = type === 'excel'
        ? await balanceService.downloadExcel(Number(exerciceId), params)
        : await balanceService.downloadPDF(Number(exerciceId), params);
            
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Balance_${typeBalance}C.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click(); link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (exerciceId) executerCalculBalance();
  }, [exerciceId, structureComptable, typeBalance]);

  const fmt = (v: number) => (!v || v === 0) ? '' : new Intl.NumberFormat('fr-BI', { maximumFractionDigits: 0 }).format(v);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* En-tête de page avec vos boutons d'exportation réglementaires */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Balance Générale de Vérification</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Contrôle arithmétique et équilibre des comptes pour la période active</p>
          </div>
          
          {/* 💡 BOUTONS REPLACÉS À LEUR EMPLACEMENT STANDARD DESIGN SYSTEM */}
          {lignes.length > 0 && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadFile('excel')} className="text-xs font-bold uppercase h-[34px] border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <i className="pi pi-file-excel text-xs mr-1"></i> Excel
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadFile('pdf')} className="text-xs font-bold uppercase h-[34px] border-rose-200 text-rose-700 hover:bg-rose-50">
                <i className="pi pi-file-pdf mr-1 text-xs"></i> PDF
              </Button>
            </div>
          )}
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        <div className="flex flex-col gap-6">
          <form onSubmit={executerCalculBalance} className="flex flex-col gap-4 bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[15%_15%_20%_20%_15%] gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Date Début</label>
                <Input type="date" value={dateDebut} onChange={(e: any) => setDateDebut(e.target.value)} className="w-full text-xs " />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Date Fin</label>
                <Input type="date" value={dateFin} onChange={(e: any) => setDateFin(e.target.value)} className="w-full text-xs " />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Format</label>
                <Select value={typeBalance} options={[{ label: '4 Colonnes', value: '4' }, { label: '6 Colonnes', value: '6' }]} onChange={(e: any) => setTypeBalance(e.value)} className="w-full text-xs " />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-navy-800 dark:text-navy-200   tracking-wider">Structure</label>
                <Select value={structureComptable} options={[{ label: 'Avec Collectifs', value: 'true' }, { label: 'Détails Seuls', value: 'false' }]} onChange={(e: any) => setStructureComptable(e.value)} className="w-full text-xs " />
              </div>
              <div className="flex flex-col gap-1">
                 <div className="h-[15px]"></div>
              <Button type="submit" disabled={loading || !exerciceId} variant="default" size="sm" className="w-full h-[30px] font-bold  text-xs tracking-wider shadow-xs">
                {loading ? 'Calcul...' : 'Calculer la balance'}
              </Button>
            </div>
            </div>
            
          </form>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <ProgressSpinner style={{ width: '40px' }} />
              <span className="text-xs text-navy-400 font-bold font-mono">Imputation des écritures...</span>
            </div>
          ) : (
            <BalanceTable lignes={lignes} typeCols={typeBalance} fmt={fmt} />
          )}
        </div>
      </div>
    </div>
  );
};
