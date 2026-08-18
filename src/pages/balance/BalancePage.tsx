import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { exerciceService } from '@/services/exercice.service';
import { balanceService } from '@/services/balance.service';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BalanceTable } from './BalanceTable';


export const BalancePage: React.FC = () => {
  const [exercices, setExercices] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [lignes, setLignes] = useState<any[]>([]);
  const [idExercice, setIdExercice] = useState<number | null>(null);
  
  const [selectedEx, setSelectedEx] = useState<any>(null);
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  const [typeBalance, setTypeBalance] = useState<string>('6'); 
  const [structureComptable, setStructureComptable] = useState<string>('false');

  const optionsType = [
    { label: '4 Colonnes', value: '4' },
    { label: '6 Colonnes', value: '6' }
  ];

  const optionsStructure = [
    { label: 'Comptes de Détails', value: 'false' },
    { label: 'Avec Comptes Collectifs', value: 'true' }
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await exerciceService.getAll();
        const mappedEx = res.map((e: any) => ({ label: e.libelle, value: e.id }));
        setExercices(mappedEx);
        if (mappedEx.length > 0) {
          setSelectedEx(mappedEx[0].value);
          setIdExercice(mappedEx[0].value);
        }
      } catch (err) {
        console.error("Erreur initialisation exercices", err);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEx) return;
    
    setIdExercice(Number(selectedEx));
    setLoading(true);
    try {
      const data = await balanceService.getBalance(Number(selectedEx), { 
        dateDebut, 
        dateFin, 
        typeBalance,
        centralisee: structureComptable === 'true'
      });
      setLignes(data);
    } catch (err) {
      console.error("Erreur de calcul de la balance", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (type: 'excel' | 'pdf') => {
    if (!idExercice) return;
    try {
      const params = { 
        dateDebut, 
        dateFin, 
        typeBalance,
        centralisee: structureComptable === 'true'
      };
      
      const blob = type === 'excel'
        ? await balanceService.downloadExcel(idExercice, params)
        : await balanceService.downloadPDF(idExercice, params);
            
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Balance_${typeBalance}C_${structureComptable === 'true' ? 'Centralisee' : 'Detail'}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Erreur lors de l'exportation ${type}`, err);
    }
  };

  const fmt = (v: number) => (!v || v === 0) ? '' : new Intl.NumberFormat('fr-BI', { maximumFractionDigits: 0 }).format(v);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">
              Balance Générale de Vérification
            </h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              Contrôle arithmétique et équilibre multiniveaux des comptes
            </p>
          </div>
          
          {lignes.length > 0 && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleDownloadFile('excel')}>
                <i className="pi pi-file-excel text-xs mr-1.5 text-emerald-600"></i> Excel
              </Button>
              <Button type="button" variant="default" size="sm" onClick={() => handleDownloadFile('pdf')}>
                <i className="pi pi-file-pdf text-xs mr-1.5"></i> PDF
              </Button>
            </div>
          )}
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {fetching ? (
          <div className="flex justify-center py-12">
            <ProgressSpinner style={{ width: '40px' }} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs  text-navy-800 dark:text-navy-200   tracking-wider">
                    Exercice Comptable
                  </label>
                  <Select
                    value={selectedEx}
                    options={exercices}
                    onChange={(e: any) => setSelectedEx(e.value)}
                    placeholder="Sélectionner"
                    className="w-full text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs   text-navy-800 dark:text-navy-200   tracking-wider">
                    Date Début (Optionnel)
                  </label>
                  <Input
                    type="date"
                    value={dateDebut}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateDebut(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs   text-navy-800 dark:text-navy-200   tracking-wider">
                    Date Fin (Optionnel)
                  </label>
                  <Input
                    type="date"
                    value={dateFin}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFin(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs   text-navy-800 dark:text-navy-200   tracking-wider">
                    Format des Colonnes
                  </label>
                  <Select
                    value={typeBalance}
                    options={optionsType}
                    onChange={(e: any) => setTypeBalance(e.value)}
                    className="w-full text-xs "
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs   text-navy-800 dark:text-navy-200   tracking-wider">
                    Structure du Plan Comptable
                  </label>
                  <Select
                    value={structureComptable}
                    options={optionsStructure}
                    onChange={(e: any) => setStructureComptable(e.value)}
                    className="w-full text-xs "
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !selectedEx} 
                  variant="default"
                  size="sm"
                  className="w-full h-[38px]   text-xs   tracking-wider shadow-xs"
                >
                  {loading ? (
                    <>
                      <i className="pi pi-spin pi-spinner mr-2 text-xs"></i>
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-percentage mr-2 text-xs"></i>
                      Générer la Balance
                    </>
                  )}
                </Button>
              </div>

            </form>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <ProgressSpinner style={{ width: '40px' }} />
                <span className="text-xs text-navy-400 font-medium">Calcul et filtrage des comptes mouvementés...</span>
              </div>
            ) : lignes.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-navy-200 dark:border-navy-800 text-xs text-navy-400 rounded-xl bg-navy-50/5 dark:bg-navy-900/5">
                <i className="pi pi-info-circle text-lg mb-2 text-navy-300 block"></i>
                Veuillez cliquer sur Générer la Balance pour auditer l'équilibre de l'exercice comptable.
              </div>
            ) : (
              <BalanceTable lignes={lignes} typeCols={typeBalance} fmt={fmt} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
