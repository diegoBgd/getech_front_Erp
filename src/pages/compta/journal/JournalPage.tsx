import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { Journal, JournalFormValues } from '@/types';
import { journalService } from '@/services/journal.service';
import { Button } from '@/components/ui/button';
import { ModalConfirm } from '@/components/ui/modal-confirm';
import { Input } from '@/components/ui/input';
import { CustomDataTable } from '@/components/ui/data-table';
import { JournalForm } from '@/components/forms/JournalForm';

export const JournalPage: React.FC = () => {
  const [journaux, setJournaux] = useState<Journal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataFetching, setDataFetching] = useState<boolean>(true);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [journalIdToDelete, setJournalIdToDelete] = useState<number | null>(null);
  const [journalCodeToDelete, setJournalCodeToDelete] = useState<string>('');

  const chargerJournaux = async () => {
    setDataFetching(true);
    try {
      const data = await journalService.getAllJournaux();
      setJournaux(data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setDataFetching(false);
    }
  };

  useEffect(() => {
    chargerJournaux();
  }, []);

  const handleOpenCreate = () => {
    setEditingJournal(null);
    setShowModal(true);
  };

  const handleOpenEdit = (journal: Journal) => {
    setEditingJournal(journal);
    setShowModal(true);
  };

  const handleOpenDeleteConfirm = (id: number, code: string) => {
    setJournalIdToDelete(id);
    setJournalCodeToDelete(code);
    setDeleteModalVisible(true);
  };

  const handleExecuteSuppression = async () => {
    if (!journalIdToDelete) return;
    setLoading(true);
    try {
      await journalService.deleteJournal(journalIdToDelete);
      setDeleteModalVisible(false);
      setJournalIdToDelete(null);
      await chargerJournaux();
    } catch (error: any) {
      const msg = error.response?.headers['x-error-message'] || "Erreur de suppression";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values: JournalFormValues) => {
    setLoading(true);
    try {
      if (editingJournal) {
        await journalService.updateJournal(editingJournal.id, values);
      } else {
        await journalService.createJournal(values);
      }
      setShowModal(false);
      setEditingJournal(null);
      await chargerJournaux();
    } catch (error) {
      console.error("Erreur d'opération", error);
    } finally {
      setLoading(false);
    }
  };

  const actionBodyTemplate = (rowData: Journal) => {
    return (
      <div className="flex gap-1 justify-end">
        <Button 
          type="button" variant="ghost" size="sm"
          className="h-8 w-8 p-0 text-sky-accent-500 rounded-full cursor-pointer"
          onClick={() => handleOpenEdit(rowData)} title="Modifier"
        >
          <i className="pi pi-pencil text-sm"></i>
        </Button>
        <Button 
          type="button" variant="ghost" size="sm"
          className="h-8 w-8 p-0 text-red-accent-500 rounded-full cursor-pointer"
          onClick={() => handleOpenDeleteConfirm(rowData.id, rowData.code)} title="Supprimer"
        >
          <i className="pi pi-trash text-sm"></i>
        </Button>
      </div>
    );
  };

  const typeTemplate = (rowData: Journal) => {
    const labels: Record<string, string> = {
      ACHATS: 'Achats', VENTES: 'Ventes', TRESORERIE: 'Trésorerie', OPERATIONS_DIVERSES: 'O.D'
    };
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border bg-navy-50 text-navy-600 border-navy-100 dark:bg-navy-800/40 dark:text-navy-300 dark:border-navy-700/50">
        {labels[rowData.typeJournal] || rowData.typeJournal}
      </span>
    );
  };

  const codeTemplate = (rowData: Journal) => {
    return (
      <div className="font-tabular text-sm font-bold tracking-wider text-navy-800 dark:text-navy-200 pl-1">
        {rowData.code}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModalConfirm
        visible={deleteModalVisible}
        title="Confirmation de suppression"
        message={`Voulez-vous supprimer définitivement le journal ${journalCodeToDelete} ?`}
        confirmLabel="Supprimer" cancelLabel="Annuler" variant="destructive" loading={loading}
        onConfirm={handleExecuteSuppression}
        onCancel={() => { setDeleteModalVisible(false); setJournalIdToDelete(null); }}
      />
      
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Journaux Comptables</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              {dataFetching ? 'Chargement...' : `${journaux.length} journal(aux) configuré(s)`}
            </p>
          </div>
          <Button variant="default" size="sm" onClick={handleOpenCreate}>
            <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un journal
          </Button>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {dataFetching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ProgressSpinner 
              style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".8s"
              pt={{ circle: { className: "stroke-navy-700 dark:stroke-sky-accent-500" } }}
            />
            <span className="text-xs text-navy-400 font-medium">Récupération des journaux...</span>
          </div>
        ) : journaux.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-navy-200 rounded-lg">
            <i className="pi pi-book text-2xl text-navy-400 mb-2"></i>
            <h4 className="text-xs font-bold text-navy-800 mb-1">Aucun journal trouvé</h4>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative w-full md:w-80">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 text-xs"></i>
              <Input
                type="text" value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Rechercher un journal..." className="pl-8 w-full"
              />
            </div>

            <div className="rounded-lg overflow-hidden">
              <CustomDataTable 
                value={journaux} dataKey="id" globalFilter={globalFilterValue}
                globalFilterFields={['code', 'intitule']}
              >
                <Column field="code" header="Code" body={codeTemplate} sortable style={{ width: '20%' }} />
                <Column field="intitule" header="Intitulé du journal" sortable style={{ width: '50%' }} />
                <Column field="typeJournal" header="Type de flux" body={typeTemplate} sortable style={{ width: '18%' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '12%' }} className="text-right" headerClassName="justify-end" />
              </CustomDataTable>
            </div>
          </div>
        )}
      </div>

      <Dialog 
        header={editingJournal ? "Modifier le journal" : "Ajouter un journal"} 
        visible={showModal} style={{ width: '420px' }} modal 
        onHide={() => { setShowModal(false); setEditingJournal(null); }}
        draggable={false} resizable={false} closable={!loading}
      >
        <JournalForm 
          onSubmit={handleFormSubmit} onCancel={() => { setShowModal(false); setEditingJournal(null); }} loading={loading}
          initialValues={editingJournal ? {
            code: editingJournal.code, intitule: editingJournal.intitule, typeJournal: editingJournal.typeJournal
          } : undefined}
        />
      </Dialog>
    </div>
  );
};
