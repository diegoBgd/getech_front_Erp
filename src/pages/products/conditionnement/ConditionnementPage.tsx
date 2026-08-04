import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConditionnementForm } from '@/components/forms/ConditionnementForm';
import { conditionnementService } from '@/services/conditionnementservice';
import { uniteMesureService } from '@/services/uniteMesureService';
import type { Conditionnement, ConditionnementFormValues, UniteMesure } from '@/types';

function formatAmount(value: number): string {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ConditionnementPage() {
  const [conditionnements, setConditionnements] = useState<Conditionnement[]>([]);
  const [unites, setUnites] = useState<UniteMesure[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Conditionnement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toastRef = useRef<Toast>(null);
  const hasLoadedRef = useRef(false);

  const unitesById = useMemo(() => {
    const map = new Map<number, UniteMesure>();
    unites.forEach((unite) => map.set(unite.id, unite));
    return map;
  }, [unites]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [conditionnementsData, unitesData] = await Promise.all([
        conditionnementService.getAll(),
        uniteMesureService.getAll(),
      ]);
      setConditionnements(conditionnementsData);
      setUnites(unitesData);
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les conditionnements.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadAll();
  }, []);

  const filteredConditionnements = useMemo(() => {
    if (!globalFilter.trim()) return conditionnements;
    const query = globalFilter.trim().toLowerCase();
    return conditionnements.filter((item) => {
      const uniteLabel = unitesById.get(item.unitId)?.libelle ?? '';
      return (
        item.barcode.toLowerCase().includes(query) ||
        String(item.itemId).includes(query) ||
        uniteLabel.toLowerCase().includes(query)
      );
    });
  }, [conditionnements, globalFilter, unitesById]);

  const openAddDialog = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Conditionnement) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values: ConditionnementFormValues) => {
    setSubmitting(true);
    try {
      if (editingItem) {
        await conditionnementService.update(editingItem.id, values);
        toastRef.current?.show({ severity: 'success', summary: 'Conditionnement modifié', detail: `"${values.barcode || '—'}" a été mis à jour.` });
      } else {
        await conditionnementService.create(values);
        toastRef.current?.show({ severity: 'success', summary: 'Conditionnement ajouté', detail: `"${values.barcode || '—'}" a été créé.` });
      }
      await loadAll();
      closeDialog();
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: "L'enregistrement a échoué." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: Conditionnement) => {
    confirmDialog({
      message: `Voulez-vous vraiment supprimer ce conditionnement (article #${item.itemId}) ? Cette action est irréversible.`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await conditionnementService.remove(item.id);
          toastRef.current?.show({ severity: 'success', summary: 'Conditionnement supprimé', detail: 'La suppression a réussi.' });
          await loadAll();
        } catch {
          toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: 'La suppression a échoué.' });
        }
      },
    });
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-navy-100">Conditionnements</h2>
              <p className="mt-0.5 text-sm text-navy-400">{conditionnements.length} conditionnement(s) au total</p>
            </div>
            <Button onClick={openAddDialog}>
              <i className="pi pi-plus" aria-hidden />
              Ajouter un conditionnement
            </Button>
          </div>

          <div className="my-4 border-t border-navy-100 dark:border-navy-700" />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <IconField iconPosition="left" className="w-full sm:w-80">
              <InputIcon className="pi pi-search" />
              <InputText
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Rechercher (code-barre, article, unité)..."
                className="w-full"
              />
            </IconField>
          </div>

          {loading ? (
            <Loader label="Chargement des conditionnements..." />
          ) : filteredConditionnements.length === 0 ? (
            <EmptyState
              icon="pi pi-box"
              title="Aucun conditionnement trouvé"
              description={globalFilter ? 'Essayez une autre recherche.' : 'Commencez par ajouter votre premier conditionnement.'}
              action={
                !globalFilter && (
                  <Button onClick={openAddDialog} size="sm">
                    Ajouter un conditionnement
                  </Button>
                )
              }
            />
          ) : (
            <DataTable
              value={filteredConditionnements}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              stripedRows
              size="small"
              emptyMessage="Aucun conditionnement trouvé."
              className="text-sm"
              tableStyle={{ width: '100%' }}
            >
              <Column field="itemId" header="Article" sortable bodyClassName="font-tabular" style={{ width: '9%' }} />
              <Column
                header="Unité"
                sortable
                sortField="unitId"
                body={(row: Conditionnement) => unitesById.get(row.unitId)?.libelle ?? `#${row.unitId}`}
                style={{ width: '13%' }}
              />
              <Column
                field="conversionFactor"
                header="Facteur"
                sortable
                bodyClassName="font-tabular"
                body={(row: Conditionnement) => formatAmount(row.conversionFactor)}
                style={{ width: '9%' }}
              />
              <Column field="barcode" header="Code-barre" bodyClassName="font-tabular" style={{ width: '16%' }} />
              <Column
                field="salePrice"
                header="Prix vente"
                sortable
                bodyStyle={{ textAlign: 'right' }}
                headerStyle={{ textAlign: 'right' }}
                bodyClassName="font-tabular"
                body={(row: Conditionnement) => formatAmount(row.salePrice)}
                style={{ width: '12%' }}
              />
              <Column
                field="purchasePrice"
                header="Prix achat"
                sortable
                bodyStyle={{ textAlign: 'right' }}
                headerStyle={{ textAlign: 'right' }}
                bodyClassName="font-tabular"
                body={(row: Conditionnement) => formatAmount(row.purchasePrice)}
                style={{ width: '12%' }}
              />
              <Column
                header="Défaut"
                body={(row: Conditionnement) =>
                  row.isDefaultSaleUnit ? <Badge variant="success">Oui</Badge> : <Badge variant="neutral">Non</Badge>
                }
                style={{ width: '9%' }}
              />
              <Column
                header="Vente / Achat"
                body={(row: Conditionnement) => (
                  <div className="flex gap-1">
                    <Badge variant={row.allowSale ? 'success' : 'neutral'}>Vente</Badge>
                    <Badge variant={row.allowPurchase ? 'success' : 'neutral'}>Achat</Badge>
                  </div>
                )}
                style={{ width: '12%' }}
              />
              <Column
                header="Actions"
                style={{ width: '8%' }}
                body={(row: Conditionnement) => (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditDialog(row)}
                      aria-label={`Modifier le conditionnement ${row.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-700"
                    >
                      <i className="pi pi-pencil text-sm" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      aria-label={`Supprimer le conditionnement ${row.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-red-accent-500 hover:bg-red-accent-500/10"
                    >
                      <i className="pi pi-trash text-sm" aria-hidden />
                    </button>
                  </div>
                )}
              />
            </DataTable>
          )}
        </CardContent>
      </Card>

      <Dialog
        header={editingItem ? 'Modifier le conditionnement' : 'Ajouter un conditionnement'}
        visible={dialogOpen}
        onHide={closeDialog}
        style={{ width: '38rem' }}
        modal
      >
        <ConditionnementForm
          defaultValues={editingItem}
          unites={unites}
          onSubmit={handleSubmit}
          onCancel={closeDialog}
          submitting={submitting}
        />
      </Dialog>
    </div>
  );
}