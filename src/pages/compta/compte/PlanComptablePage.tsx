import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import type { Compte, CompteFormValues } from '@/types';
import { compteService } from '@/services/compte.service';
import { Button } from '@/components/ui/button';
import { ModalConfirm } from '@/components/ui/modal-confirm';
import { CompteForm } from '@/components/forms/CompteForm';

export const PlanComptablePage: React.FC = () => {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingCompte, setEditingCompte] = useState<Compte | null>(null);

  // États pour contrôler la modale personnalisée de suppression
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [compteIdToDelete, setCompteIdToDelete] = useState<number | null>(null);
  const [compteCodeToDelete, setCompteCodeToDelete] = useState<string>('');

  const chargerPlanComptable = async () => {
    try {
      const data = await compteService.getAllComptes();
      setComptes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des comptes", error);
    }
  };

  useEffect(() => {
    chargerPlanComptable();
  }, []);

  const handleOpenCreate = () => {
    setEditingCompte(null);
    setShowModal(true);
  };

  const handleOpenEdit = (compte: Compte) => {
    setEditingCompte(compte);
    setShowModal(true);
  };

  // Déclenche l'affichage de notre modale personnalisée
  const handleOpenDeleteConfirm = (id: number, code: string) => {
    setCompteIdToDelete(id);
    setCompteCodeToDelete(code);
    setDeleteModalVisible(true);
  };

  // Exécution de l'action de suppression depuis la modale UI
  const handleExecuteSuppression = async () => {
    if (!compteIdToDelete) return;
    setLoading(true);
    try {
      await compteService.deleteCompte(compteIdToDelete);
      setDeleteModalVisible(false);
      setCompteIdToDelete(null);
      await chargerPlanComptable();
    } catch (error: any) {
      const msg = error.response?.headers['x-error-message'] || "Impossible de supprimer ce compte.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values: CompteFormValues) => {
    setLoading(true);
    try {
      if (editingCompte) {
        await compteService.updateCompte(editingCompte.id, values);
      } else {
        await compteService.createCompte(values);
      }
      setShowModal(false);
      setEditingCompte(null);
      await chargerPlanComptable();
    } catch (error) {
      console.error("Erreur opérationnelle", error);
    } finally {
      setLoading(false);
    }
  };

  const actionBodyTemplate = (rowData: Compte) => {
    return (
      <div className="flex gap-1 justify-end">
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-sky-accent-500 hover:text-sky-accent-600 hover:bg-sky-accent-50/40 rounded-full cursor-pointer"
          onClick={() => handleOpenEdit(rowData)}
          title="Modifier"
        >
          <i className="pi pi-pencil text-sm"></i>
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-red-accent-500 hover:text-red-700 hover:bg-red-50/40 rounded-full cursor-pointer"
          onClick={() => handleOpenDeleteConfirm(rowData.id, rowData.code)} // 💡 Ouvre la nouvelle modale
          title="Supprimer"
        >
          <i className="pi pi-trash text-sm"></i>
        </Button>
      </div>
    );
  };

  const typeTemplate = (rowData: Compte) => {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        rowData.isCollectif 
          ? 'bg-sky-accent-50 text-sky-accent-600 dark:bg-sky-accent-950/40 dark:text-sky-accent-400' 
          : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-navy-300'
      }`}>
        {rowData.isCollectif ? 'Collectif' : 'Détail'}
      </span>
    );
  };

  const codeTemplate = (rowData: Compte) => {
    return <span className="font-tabular font-bold tracking-wide text-navy-900 dark:text-white">{rowData.code}</span>;
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-navy-900/20 rounded-xl border border-dashed border-navy-200 dark:border-navy-800 my-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-navy-50 dark:bg-navy-900/60 flex items-center justify-center mb-3 text-navy-400 dark:text-navy-500">
          <i className="pi pi-folder-open text-3xl"></i>
        </div>
        <h4 className="text-sm font-bold text-navy-800 dark:text-navy-200 mb-1">Aucun compte comptable trouvé</h4>
        <p className="text-xs text-navy-400 dark:text-navy-500 max-w-xs mb-4">
          Votre plan comptable est vide. Commencez par ajouter vos comptes racines ou sous-comptes de mouvements.
        </p>
        <Button variant="default" size="sm" onClick={handleOpenCreate}>
          <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un compte
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-4">
      
      {/* 💡 Utilisation de votre composant de confirmation personnalisé 100% aligné sur Shadcn/UI */}
      <ModalConfirm
        visible={deleteModalVisible}
        title="Confirmation de suppression"
        message={`Êtes-vous sûr de vouloir supprimer définitivement le compte ${compteCodeToDelete} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="destructive" // Bouton de confirmation en rouge destructif natif
        loading={loading}
        onConfirm={handleExecuteSuppression}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCompteIdToDelete(null);
        }}
      />
      
      <div className="flex justify-between items-center bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Plan Comptable Général</h2>
          <p className="text-xs text-navy-400 dark:text-navy-500">{comptes.length} compte(s) référencé(s)</p>
        </div>
        <Button variant="default" size="sm" onClick={handleOpenCreate}>
          <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un compte
        </Button>
      </div>

      {comptes.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-xs overflow-hidden">
          <DataTable 
            value={comptes} 
            paginator 
            rows={10} 
            dataKey="id" 
            responsiveLayout="scroll"
            className="p-datatable-sm"
          >
            <Column field="code" header="Code" body={codeTemplate} sortable style={{ width: '20%' }} />
            <Column field="intitule" header="Libellé / Intitulé" sortable style={{ width: '40%' }} />
            <Column field="niveau" header="Niveau" sortable className="text-center" headerClassName="justify-center" style={{ width: '10%' }} />
            <Column field="isCollectif" header="Structure" body={typeTemplate} style={{ width: '15%' }} />
            <Column header="Actions" body={actionBodyTemplate} style={{ width: '15%' }} className="text-right" headerClassName="justify-end" />
          </DataTable>
        </div>
      )}

      <Dialog 
        header={editingCompte ? "Modifier le compte comptable" : "Ajouter un compte comptable"} 
        visible={showModal} 
        style={{ width: '420px' }} 
        modal 
        onHide={() => {
          setShowModal(false);
          setEditingCompte(null);
        }}
        draggable={false}
        resizable={false}
        closable={!loading}
      >
        <CompteForm 
          onSubmit={handleFormSubmit} 
          onCancel={() => {
            setShowModal(false);
            setEditingCompte(null);
          }} 
          loading={loading}
          initialValues={editingCompte ? {
            code: editingCompte.code,
            intitule: editingCompte.intitule,
            isCollectif: editingCompte.isCollectif
          } : undefined}
        />
      </Dialog>
    </div>
  );
};
