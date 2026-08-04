import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from '@/components/ui/button';
import type { ProductCategory, ProductCategoryFormValues } from '@/types';

interface CategoryFormProps {
  defaultValues?: ProductCategory | null;
  onSubmit: (values: ProductCategoryFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

/**
 * Formulaire réutilisable pour l'ajout ET la modification d'une catégorie
 * (react-hook-form gère la validation et l'état, le composant parent gère
 * la persistance via categoryService).
 */
export function CategoryForm({ defaultValues, onSubmit, onCancel, submitting }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductCategoryFormValues>({
    defaultValues: {
      code: defaultValues?.code,
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      status: defaultValues?.status ?? 'active',
    },
  });

  useEffect(() => {
    reset({
      code: defaultValues?.code,
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      status: defaultValues?.status ?? 'active',
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        
         <label htmlFor="name" className="text-sm font-medium text-navy-700 dark:text-navy-200">
         Code <span className="text-red-accent-500">*</span>
        </label>
      
       <InputText
          id="code"
          className="w-full"
          placeholder="Ex: C-001"
          {...register('code', { required: 'Le code est obligatoire', maxLength: { value: 5, message: 'Maximum 5 caractères' } })}
        />
        <label htmlFor="name" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Nom de la catégorie <span className="text-red-accent-500">*</span>
        </label>
        <InputText
          id="name"
          className="w-full"
          placeholder="Ex: Électronique"
          {...register('name', { required: 'Le nom est obligatoire', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
        />
        {errors.name && <span className="text-xs text-red-accent-500">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none focus:border-sky-accent-500 dark:border-navy-600 dark:bg-navy-900 dark:text-navy-100"
          placeholder="Courte description de la catégorie"
          {...register('description')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Statut
        </label>
        <select
          id="status"
          className="w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none focus:border-sky-accent-500 dark:border-navy-600 dark:bg-navy-900 dark:text-navy-100"
          {...register('status')}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement...' : defaultValues ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
