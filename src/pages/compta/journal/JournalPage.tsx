import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import type { Journal, JournalFormValues } from '@/types';
import { journalService } from '@/services/journal.service';
import { Button } from '@/components/ui/button';
import { JournalForm } from '@/components/forms/JournalForm';

export const JournalPage: React.FC = () => {
  const [journaux, setJournaux] = useState<Journal[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingJournal, setEditingJournal] = useState<JournalFormValues | null>(null);

  const chargerJournaux = async () => {
    try {
      const data = await journalService.getAllJournaux();
      setJournaux(data);
    } catch (error) {
      console.error("Erreur de chargement des journaux", error);
    }
  };

  useEffect(() => {
    chargerJournaux();
  }, []);

  const handleOpenCreate = () => {
    setEditingJournal(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (values: JournalFormValues) => {
    setLoading(true);
    try {
      await journalService.createJournal(values);
      setShowModal(false);
      await chargerJournaux();
    } catch (error) {
      console.error("Erreur lors de la création du journal", error);
    } finally  {
      setLoading(false);
    }
  };

  // Colonne dynamique Actions (remplace l'ancien statut)
  const actionBodyTemplate = (rowData: Journal) => {
    return (
      <div className="flex gap-1 justify-end">
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-sky-accent-500 hover:text-sky-accent-600 hover:bg-sky-accent-50/40 rounded-full"
          onClick={() => {
            setEditingJournal({ code: rowData.code, intitule: rowData.intitule, typeJournal: rowData.typeJournal });
            setShowModal(true);
          }}
          title="Modifier"
        >
          <i className="pi pi-pencil text-sm"></i>
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-red-accent-500 hover:text-red-700 hover:bg-red-50/40 rounded-full"
          onClick={() => console.log('Demande de désactivation du journal ID:', rowData.id)}
          title="Désactiver"
        >
          <i className="pi pi-ban text-sm"></i>
        </Button>
      </div>
    );
  };

  // Badge stylisé basé sur la nomenclature de votre palette d'ERP
  const typeTemplate = (rowData: Journal) => {
    const labels: Record<string, { text: string; css: string }> = {
      ACHATS: { text: 'Achats', css: 'bg-navy-50 text-navy-700' },
      VENTES: { text: 'Ventes', css: 'bg-sky-accent-50 text-sky-accent-600' },
      TRESORERIE: { text: 'Trésorerie', css: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' },
      OPERATIONS_DIVERSES: { text: 'O.D', css: 'bg-amber-accent-50 text-amber-accent-500 bg-amber-50' }
    };
    const info = labels[rowData.typeJournal] || { text: rowData.typeJournal, css: 'bg-gray-100' };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${info.css}`}>{info.text}</span>;
  };

  const codeTemplate = (rowData: Journal) => {
    return <span className="font-tabular font-bold tracking-wider text-navy-900 dark:text-white bg-navy-50/50 px-1.5 py-0.5 rounded-sm border border-navy-100/60">{rowData.code}</span>;
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-navy-900/20 rounded-xl border border-dashed border-navy-200 dark:border-navy-800 my-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-navy-50 dark:bg-navy-900/60 flex items-center justify-center mb-3 text-navy-400 dark:text-navy-500">
          <i className="pi pi-book text-3xl"></i>
        </div>
        <h4 className="text-sm font-bold text-navy-800 dark:text-navy-200 mb-1">Aucun journal comptable</h4>
        <p className="text-xs text-navy-400 dark:text-navy-500 max-w-xs mb-4">
          Les journaux servent à segmenter vos écritures (Banque, Achats, Ventes). Ajoutez-en un pour commencer la saisie de pièces.
        </p>
        <Button variant="default" size="sm" onClick={handleOpenCreate}>
          <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un journal
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-4">
      {/* En-tête de page blanc encadré */}
      <div className="flex justify-between items-center bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Journaux Comptables</h2>
          <p className="text-xs text-navy-400 dark:text-navy-500">{journaux.length} journal(aux) actif(s)</p>
        </div>
        <Button variant="default" size="sm" onClick={handleOpenCreate}>
          <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un journal
        </Button>
      </div>

      {/* Grille ou panneau vide */}
      {journaux.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-xs overflow-hidden">
          <DataTable value={journaux} paginator rows={10} dataKey="id" responsiveLayout="scroll" className="p-datatable-sm">
            <Column field="code" header="Code" body={codeTemplate} sortable style={{ width: '15%' }} />
            <Column field="intitule" header="Intitulé du journal" sortable style={{ width: '45%' }} />
            <Column field="typeJournal" header="Type de flux" body={typeTemplate} sortable style={{ width: '25%' }} />
            <Column header="Actions" body={actionBodyTemplate} style={{ width: '15%' }} className="text-right" headerClassName="justify-end" />
          </DataTable>
        </div>
      )}

      {/* Fenêtre Modale d'Action */}
      <Dialog 
        header={editingJournal ? "Modifier le journal" : "Ajouter un journal de mesure"} 
        visible={showModal} 
        style={{ width: '420px' }} 
        modal 
        onHide={() => setShowModal(false)}
        draggable={false}
        resizable={false}
        closable={!loading}
      >
        <JournalForm 
          onSubmit={handleFormSubmit} 
          onCancel={() => setShowModal(false)} 
          loading={loading}
          initialValues={editingJournal || undefined}
        />
      </Dialog>
    </div>
  );
};
