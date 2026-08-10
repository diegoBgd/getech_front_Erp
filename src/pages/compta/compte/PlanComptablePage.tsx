import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { Compte, CompteFormValues } from '@/types';
import { compteService } from '@/services/compte.service';
import { Button } from '@/components/ui/button';
import { ModalConfirm } from '@/components/ui/modal-confirm';
import { Input } from '@/components/ui/input';
import { CustomDataTable } from '@/components/ui/data-table';
import { CompteForm } from '@/components/forms/CompteForm';


export const PlanComptablePage: React.FC = () => {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataFetching, setDataFetching] = useState<boolean>(true);
  const [editingCompte, setEditingCompte] = useState<Compte | null>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [compteIdToDelete, setCompteIdToDelete] = useState<number | null>(null);
  const [compteCodeToDelete, setCompteCodeToDelete] = useState<string>('');

  const chargerPlanComptable = async () => {
    setDataFetching(true);
    try {
      const data = await compteService.getAllComptes();
      setComptes(data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setDataFetching(false);
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

  const handleOpenDeleteConfirm = (id: number, code: string) => {
    setCompteIdToDelete(id);
    setCompteCodeToDelete(code);
    setDeleteModalVisible(true);
  };

  const handleExecuteSuppression = async () => {
    if (!compteIdToDelete) return;
    setLoading(true);
    try {
      await compteService.deleteCompte(compteIdToDelete);
      setDeleteModalVisible(false);
      setCompteIdToDelete(null);
      await chargerPlanComptable();
    } catch (error: any) {
      const msg = error.response?.headers['x-error-message'] || "Erreur de suppression";
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

  const typeTemplate = (rowData: Compte) => {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
        rowData.isCollectif 
          ? 'bg-sky-accent-50/60 text-sky-accent-600 border-sky-accent-100/70 dark:bg-sky-accent-950/20' 
          : 'bg-navy-50 text-navy-600 border-navy-100 dark:bg-navy-800/40'
      }`}>
        {rowData.isCollectif ? 'Collectif' : 'Détail'}
      </span>
    );
  };

  const codeTemplate = (rowData: Compte) => {
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
        message={`Voulez-vous supprimer définitivement le compte ${compteCodeToDelete} ?`}
        confirmLabel="Supprimer" cancelLabel="Annuler" variant="destructive" loading={loading}
        onConfirm={handleExecuteSuppression}
        onCancel={() => { setDeleteModalVisible(false); setCompteIdToDelete(null); }}
      />
      
      {/* CARTE UNIQUE UNIFIÉE */}
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Plan Comptable Général</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              {dataFetching ? 'Chargement...' : `${comptes.length} compte(s) référencé(s)`}
            </p>
          </div>
          <Button variant="default" size="sm" onClick={handleOpenCreate}>
            <i className="pi pi-plus text-xs mr-1.5"></i> Ajouter un compte
          </Button>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {dataFetching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <ProgressSpinner 
              style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".8s"
              pt={{ circle: { className: "stroke-navy-700 dark:stroke-sky-accent-500" } }}
            />
            <span className="text-xs text-navy-400 font-medium">Récupération du plan comptable...</span>
          </div>
        ) : comptes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-navy-200 rounded-lg">
            <i className="pi pi-folder-open text-2xl text-navy-400 mb-2"></i>
            <h4 className="text-xs font-bold text-navy-800 mb-1">Aucun compte trouvé</h4>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative w-full md:w-80">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 text-xs"></i>
              <Input
                type="text" value={globalFilterValue}
                onChange={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Rechercher un compte comptable..." className="pl-8 w-full"
              />
            </div>

            <div className="rounded-lg overflow-hidden">
              <CustomDataTable 
                value={comptes} dataKey="id" globalFilter={globalFilterValue}
                globalFilterFields={['code', 'intitule']}
              >
                <Column field="code" header="Code" body={codeTemplate} sortable style={{ width: '20%' }} />
                <Column field="intitule" header="Libellé / Intitulé" sortable style={{ width: '45%' }} />
                <Column field="niveau" header="Niveau" sortable className="text-center" headerClassName="justify-center" style={{ width: '10%' }} />
                <Column field="isCollectif" header="Structure" body={typeTemplate} style={{ width: '13%' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '12%' }} className="text-right" headerClassName="justify-end" />
              </CustomDataTable>
            </div>
          </div>
        )}
      </div>

      <Dialog 
        header={editingCompte ? "Modifier le compte" : "Ajouter un compte"} 
        visible={showModal} style={{ width: '420px' }} modal 
        onHide={() => { setShowModal(false); setEditingCompte(null); }}
        draggable={false} resizable={false} closable={!loading}
      >
        <CompteForm 
          onSubmit={handleFormSubmit} onCancel={() => { setShowModal(false); setEditingCompte(null); }} loading={loading}
          initialValues={editingCompte ? {
            code: editingCompte.code, intitule: editingCompte.intitule, isCollectif: editingCompte.isCollectif
          } : undefined}
        />
      </Dialog>
    </div>
  );
};
