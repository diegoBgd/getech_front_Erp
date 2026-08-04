import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from '@/components/ui/button';
import { typeMesureOptions } from '@/types';
import type { UniteMesure, UniteMesureFormValues } from '@/types';

interface UniteMesureFormProps {
  defaultValues?: UniteMesure | null;
  onSubmit: (values: UniteMesureFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

/**
 * Formulaire réutilisable pour l'ajout ET la modification d'une unité de
 * mesure (même approche que CategoryForm.tsx).
 */
export function UniteMesureForm({ defaultValues, onSubmit, onCancel, submitting }: UniteMesureFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UniteMesureFormValues>({
    defaultValues: {
      code: defaultValues?.code ?? '',
      libelle: defaultValues?.libelle ?? '',
      typeMesure: defaultValues?.typeMesure ?? 'quantite',
    },
  });

  useEffect(() => {
    reset({
      code: defaultValues?.code ?? '',
      libelle: defaultValues?.libelle ?? '',
      typeMesure: defaultValues?.typeMesure ?? 'quantite',
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Code <span className="text-red-accent-500">*</span>
        </label>
        <InputText
          id="code"
          className="w-full"
          placeholder="Ex: KG"
          {...register('code', { required: 'Le code est obligatoire' })}
        />
        {errors.code && <span className="text-xs text-red-accent-500">{errors.code.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="libelle" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Libellé <span className="text-red-accent-500">*</span>
        </label>
        <InputText
          id="libelle"
          className="w-full"
          placeholder="Ex: Kilogramme"
          {...register('libelle', { required: 'Le libellé est obligatoire', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
        />
        {errors.libelle && <span className="text-xs text-red-accent-500">{errors.libelle.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="typeMesure" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Type de mesure <span className="text-red-accent-500">*</span>
        </label>
        <select
          id="typeMesure"
          className="w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none focus:border-sky-accent-500 dark:border-navy-600 dark:bg-navy-900 dark:text-navy-100"
          {...register('typeMesure', { required: true })}
        >
          {typeMesureOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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