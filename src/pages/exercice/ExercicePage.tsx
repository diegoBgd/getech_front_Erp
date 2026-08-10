import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { Exercice, ExerciceFormValues } from '@/types/exercice.types';
import { exerciceService } from '@/services/exercice.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomDataTable } from '@/components/ui/data-table';
import { ExerciceForm } from '@/components/forms/ExerciceForm';

export const ExercicePage: React.FC = () => {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [filterValue, setFilterValue] = useState<string>('');

  const chargerExercices = async () => {
    setFetching(true);
    try {
      const data = await exerciceService.getAll();
      setExercices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { chargerExercices(); }, []);

  const handleFormSubmit = async (values: ExerciceFormValues) => {
    setLoading(true);
    try {
      await exerciceService.create(values);
      setShowModal(false);
      await chargerExercices();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statutTemplate = (row: Exercice) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
      row.statut === 'OUVERT' 
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
        : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
    }`}>
      {row.statut}
    </span>
  );

  const codeTemplate = (row: Exercice) => (
    <div className="font-tabular text-sm font-bold tracking-wider text-navy-800 dark:text-navy-200 pl-1">
      {row.code}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* STRUCTURE DE CARTE UNIQUE FUSIONNÉE */}
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Exercices Comptables</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              {fetching ? 'Chargement...' : `${exercices.length} période(s) enregistrée(s)`}
            </p>
          </div>
          <Button variant="default" size="sm" onClick={() => setShowModal(true)}>
            <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un exercice
          </Button>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ProgressSpinner 
              style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".8s"
              pt={{ circle: { className: "stroke-navy-700 dark:stroke-sky-accent-500" } }}
            />
            <span className="text-xs text-navy-400 dark:text-navy-500 font-medium">Récupération des exercices...</span>
          </div>
        ) : exercices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-navy-200 dark:border-navy-800 rounded-lg">
            <i className="pi pi-calendar text-2xl text-navy-400 mb-2"></i>
            <h4 className="text-xs font-bold text-navy-800 dark:text-navy-200 mb-1">Aucun exercice disponible</h4>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative w-full md:w-80">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 text-xs"></i>
              <Input 
                type="text" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} 
                placeholder="Rechercher un exercice..." className="pl-8 w-full" 
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <CustomDataTable value={exercices} dataKey="id" globalFilter={filterValue} globalFilterFields={['code', 'libelle']}>
                <Column field="code" header="Code" body={codeTemplate} sortable style={{ width: '15%' }} />
                <Column field="libelle" header="Libellé de l'exercice" sortable style={{ width: '40%' }} />
                <Column field="dateDebut" header="Date d'ouverture" sortable style={{ width: '20%' }} />
                <Column field="dateFin" header="Date de clôture" sortable style={{ width: '15%' }} />
                <Column field="statut" header="Statut" body={statutTemplate} style={{ width: '10%' }} className="text-center" headerClassName="justify-center" />
              </CustomDataTable>
            </div>
          </div>
        )}
      </div>

      <Dialog 
        header="Ajouter un exercice comptable" visible={showModal} style={{ width: '420px' }} 
        modal onHide={() => setShowModal(false)} draggable={false} resizable={false} closable={!loading}
      >
        <ExerciceForm onSubmit={handleFormSubmit} onCancel={() => setShowModal(false)} loading={loading} />
      </Dialog>
    </div>
  );
};
