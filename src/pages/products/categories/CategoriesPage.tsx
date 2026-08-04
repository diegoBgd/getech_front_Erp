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
import { CategoryForm } from '@/components/forms/CategoryForm';
import { categoryService } from '@/services/categoryService';

import type { ProductCategory, ProductCategoryFormValues } from '@/types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);



  const toastRef = useRef<Toast>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les catégories.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!globalFilter.trim()) return categories;
    const query = globalFilter.trim().toLowerCase();
    return categories.filter(
      (category) => category.name.toLowerCase().includes(query) || category.description.toLowerCase().includes(query),
    );
  }, [categories, globalFilter]);

  const openAddDialog = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category: ProductCategory) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (values: ProductCategoryFormValues) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, values);
        toastRef.current?.show({ severity: 'success', summary: 'Catégorie modifiée', detail: `"${values.name}" a été mise à jour.` });
      } else {
        await categoryService.create(values);
        toastRef.current?.show({ severity: 'success', summary: 'Catégorie ajoutée', detail: `"${values.name}" a été créée.` });
      }
      await loadCategories();
      closeDialog();
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: "L'enregistrement a échoué." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (category: ProductCategory) => {
    confirmDialog({
      message: `Voulez-vous vraiment supprimer la catégorie "${category.name}" ? Cette action est irréversible.`,
      header: 'Confirmer la suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await categoryService.remove(category.id);
          toastRef.current?.show({ severity: 'success', summary: 'Catégorie supprimée', detail: `"${category.name}" a été supprimée.` });
          await loadCategories();
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
              <h2 className="text-xl font-bold text-navy-800 dark:text-navy-100">Catégories Produit</h2>
              <p className="mt-0.5 text-sm text-navy-400">{categories.length} catégorie(s) au total</p>
            </div>
            <Button onClick={openAddDialog}>
              <i className="pi pi-plus" aria-hidden />
              Ajouter une catégorie
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
                placeholder="Rechercher une catégorie..."
                className="w-full"
              />
            </IconField>
          </div>

          {loading ? (
            <Loader label="Chargement des catégories..." />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              icon="pi pi-tags"
              title="Aucune catégorie trouvée"
              description={globalFilter ? 'Essayez une autre recherche.' : 'Commencez par ajouter votre première catégorie.'}
              action={
                !globalFilter && (
                  <Button onClick={openAddDialog} size="sm">
                    Ajouter une catégorie
                  </Button>
                )
              }
            />
          ) : (
            <DataTable
              value={filteredCategories}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              stripedRows
              size="small"
              emptyMessage="Aucune catégorie trouvée."
              className="text-sm"
              showGridlines
              tableStyle={{ width: '100%' }}
            >
              <Column field="code" header="Code" sortable style={{ width: '5%' }} />
              <Column field="name" header="Nom" sortable style={{ width: '20%' }} />
              <Column field="description" header="Description" style={{ width: '50%' }} />
              <Column
                field="status"
                header="Statut"
                sortable
                body={(row: ProductCategory) => (
                  <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>
                    {row.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                )}
                style={{ width: '5%' }}
              />

              <Column
                header="Actions"
                style={{ width: '10%' }}
                body={(row: ProductCategory) => (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditDialog(row)}
                      aria-label={`Modifier ${row.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-700"
                    >
                      <i className="pi pi-pencil text-sm" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      aria-label={`Supprimer ${row.name}`}
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
        header={editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        visible={dialogOpen}
        onHide={closeDialog}
        style={{ width: '32rem' }}
        modal
      >
        <CategoryForm defaultValues={editingCategory} onSubmit={handleSubmit} onCancel={closeDialog} submitting={submitting} />
      </Dialog>
    </div>
  );
}
