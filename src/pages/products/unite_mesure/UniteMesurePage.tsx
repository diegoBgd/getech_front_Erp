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
import { UniteMesureForm } from '@/components/forms/UniteMesureForm';
import { uniteMesureService } from '@/services/uniteMesureService';
import { typeMesureLabels } from '@/types';
import type { TypeMesure, UniteMesure, UniteMesureFormValues } from '@/types';

/** Une couleur de badge par type de mesure, pour repérer visuellement les familles d'unités. */
const typeMesureBadgeVariant: Record<TypeMesure, 'neutral' | 'success' | 'warning' | 'danger'> = {
  volume: 'success',
  poids: 'warning',
  quantite: 'neutral',
  longueur: 'danger',
};

export function UniteMesurePage() {
  const [unites, setUnites] = useState<UniteMesure[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnite, setEditingUnite] = useState<UniteMesure | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toastRef = useRef<Toast>(null);
  const hasLoadedRef = useRef(false);

  const loadUnites = async () => {
    setLoading(true);
    try {
      const data = await uniteMesureService.getAll();
      setUnites(data);
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les unités de mesure.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Garde-fou contre le double-appel de React StrictMode en développement.
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadUnites();
  }, []);

  const filteredUnites = useMemo(() => {
    if (!globalFilter.trim()) return unites;
    const query = globalFilter.trim().toLowerCase();
    return unites.filter(
      (unite) =>
        unite.code.toLowerCase().includes(query) ||
        unite.libelle.toLowerCase().includes(query) ||
        typeMesureLabels[unite.typeMesure].toLowerCase().includes(query),
    );
  }, [unites, globalFilter]);

  const openAddDialog = () => {
    setEditingUnite(null);
    setDialogOpen(true);
  };

  const openEditDialog = (unite: UniteMesure) => {
    setEditingUnite(unite);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUnite(null);
  };

  const handleSubmit = async (values: UniteMesureFormValues) => {
    setSubmitting(true);
    try {
      if (editingUnite) {
        await uniteMesureService.update(editingUnite.id, values);
        toastRef.current?.show({ severity: 'success', summary: 'Unité modifiée', detail: `"${values.libelle}" a été mise à jour.` });
      } else {
        await uniteMesureService.create(values);
        toastRef.current?.show({ severity: 'success', summary: 'Unité ajoutée', detail: `"${values.libelle}" a été créée.` });
      }
      await loadUnites();
      closeDialog();
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: "L'enregistrement a échoué." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (unite: UniteMesure) => {
    confirmDialog({
      message: `Voulez-vous vraiment supprimer l'unité "${unite.libelle}" ? Cette action est irréversible.`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await uniteMesureService.remove(unite.id);
          toastRef.current?.show({ severity: 'success', summary: 'Unité supprimée', detail: `"${unite.libelle}" a été supprimée.` });
          await loadUnites();
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
          {/* En-tête de la page + action principale, dans le même conteneur que le tableau */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-navy-800 dark:text-navy-100">Unités de Mesure</h2>
              <p className="mt-0.5 text-sm text-navy-400">{unites.length} unité(s) au total</p>
            </div>
            <Button onClick={openAddDialog}>
              <i className="pi pi-plus" aria-hidden />
              Ajouter une unité
            </Button>
          </div>

          {/* Divider séparant l'en-tête (titre + action) du contenu (recherche + tableau) */}
          <div className="my-4 border-t border-navy-100 dark:border-navy-700" />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <IconField iconPosition="left" className="w-full sm:w-80">
              <InputIcon className="pi pi-search" />
              <InputText
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Rechercher une unité de mesure..."
                className="w-full"
              />
            </IconField>
          </div>

          {loading ? (
            <Loader label="Chargement des unités de mesure..." />
          ) : filteredUnites.length === 0 ? (
            <EmptyState
              icon="pi pi-calculator"
              title="Aucune unité de mesure trouvée"
              description={globalFilter ? 'Essayez une autre recherche.' : 'Commencez par ajouter votre première unité de mesure.'}
              action={
                !globalFilter && (
                  <Button onClick={openAddDialog} size="sm">
                    Ajouter une unité
                  </Button>
                )
              }
            />
          ) : (
            <DataTable
              value={filteredUnites}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              stripedRows
              size="small"
              emptyMessage="Aucune unité de mesure trouvée."
              className="text-sm"
              tableStyle={{ width: '100%' }}
            >
              <Column field="code" header="Code" sortable bodyClassName="font-tabular" style={{ width: '18%' }} />
              <Column field="libelle" header="Libellé" sortable style={{ width: '32%' }} />
              <Column
                field="typeMesure"
                header="Type de mesure"
                sortable
                body={(row: UniteMesure) => (
                  <Badge variant={typeMesureBadgeVariant[row.typeMesure]}>{typeMesureLabels[row.typeMesure]}</Badge>
                )}
                style={{ width: '30%' }}
              />
              <Column
                header="Actions"
                style={{ width: '20%' }}
                body={(row: UniteMesure) => (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditDialog(row)}
                      aria-label={`Modifier ${row.libelle}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-700"
                    >
                      <i className="pi pi-pencil text-sm" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      aria-label={`Supprimer ${row.libelle}`}
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
        header={editingUnite ? "Modifier l'unité de mesure" : 'Ajouter une unité de mesure'}
        visible={dialogOpen}
        onHide={closeDialog}
        style={{ width: '32rem' }}
        modal
      >
        <UniteMesureForm defaultValues={editingUnite} onSubmit={handleSubmit} onCancel={closeDialog} submitting={submitting} />
      </Dialog>
    </div>
  );
}