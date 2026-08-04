import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from '@/components/ui/button';
import type { Conditionnement, ConditionnementFormValues, UniteMesure } from '@/types';

interface ConditionnementFormProps {
  defaultValues?: Conditionnement | null;
  /** Unités de mesure disponibles, pour peupler le <select> UnitId (chargées une seule fois par la page). */
  unites: UniteMesure[];
  onSubmit: (values: ConditionnementFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const emptyDefaults: ConditionnementFormValues = {
  itemId: 0,
  unitId: 0,
  conversionFactor: 1,
  barcode: '',
  salePrice: 0,
  purchasePrice: 0,
  isDefaultSaleUnit: false,
  allowPurchase: true,
  allowSale: true,
};

export function ConditionnementForm({ defaultValues, unites, onSubmit, onCancel, submitting }: ConditionnementFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConditionnementFormValues>({
    defaultValues: defaultValues
      ? {
          itemId: defaultValues.itemId,
          unitId: defaultValues.unitId,
          conversionFactor: defaultValues.conversionFactor,
          barcode: defaultValues.barcode,
          salePrice: defaultValues.salePrice,
          purchasePrice: defaultValues.purchasePrice,
          isDefaultSaleUnit: defaultValues.isDefaultSaleUnit,
          allowPurchase: defaultValues.allowPurchase,
          allowSale: defaultValues.allowSale,
        }
      : emptyDefaults,
  });

  useEffect(() => {
    reset(
      defaultValues
        ? {
            itemId: defaultValues.itemId,
            unitId: defaultValues.unitId,
            conversionFactor: defaultValues.conversionFactor,
            barcode: defaultValues.barcode,
            salePrice: defaultValues.salePrice,
            purchasePrice: defaultValues.purchasePrice,
            isDefaultSaleUnit: defaultValues.isDefaultSaleUnit,
            allowPurchase: defaultValues.allowPurchase,
            allowSale: defaultValues.allowSale,
          }
        : emptyDefaults,
    );
  }, [defaultValues, reset]);

  const selectClassName =
    'w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none focus:border-sky-accent-500 dark:border-navy-600 dark:bg-navy-900 dark:text-navy-100';
  const checkboxRowClassName = 'flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="itemId" className="text-sm font-medium text-navy-700 dark:text-navy-200">
            ID Article <span className="text-red-accent-500">*</span>
          </label>
          <InputText
            id="itemId"
            type="number"
            className="w-full"
            placeholder="Ex: 12"
            {...register('itemId', { required: 'Obligatoire', valueAsNumber: true, min: { value: 1, message: 'Doit être positif' } })}
          />
          {errors.itemId && <span className="text-xs text-red-accent-500">{errors.itemId.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="unitId" className="text-sm font-medium text-navy-700 dark:text-navy-200">
            Unité de mesure <span className="text-red-accent-500">*</span>
          </label>
          <select
            id="unitId"
            className={selectClassName}
            {...register('unitId', { required: true, valueAsNumber: true, min: 1 })}
          >
            <option value={0} disabled>
              Sélectionner...
            </option>
            {unites.map((unite) => (
              <option key={unite.id} value={unite.id}>
                {unite.libelle} ({unite.code})
              </option>
            ))}
          </select>
          {errors.unitId && <span className="text-xs text-red-accent-500">Sélectionnez une unité</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="barcode" className="text-sm font-medium text-navy-700 dark:text-navy-200">
          Code-barre
        </label>
        <InputText id="barcode" className="w-full" placeholder="Ex: 6009876543210" {...register('barcode')} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="conversionFactor" className="text-sm font-medium text-navy-700 dark:text-navy-200">
            Facteur conversion <span className="text-red-accent-500">*</span>
          </label>
          <InputText
            id="conversionFactor"
            type="number"
            step="0.01"
            className="w-full"
            {...register('conversionFactor', { required: true, valueAsNumber: true, min: { value: 0.01, message: '> 0' } })}
          />
          {errors.conversionFactor && <span className="text-xs text-red-accent-500">{errors.conversionFactor.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="salePrice" className="text-sm font-medium text-navy-700 dark:text-navy-200">
            Prix de vente <span className="text-red-accent-500">*</span>
          </label>
          <InputText
            id="salePrice"
            type="number"
            step="0.01"
            className="w-full"
            {...register('salePrice', { required: true, valueAsNumber: true, min: { value: 0, message: '≥ 0' } })}
          />
          {errors.salePrice && <span className="text-xs text-red-accent-500">{errors.salePrice.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="purchasePrice" className="text-sm font-medium text-navy-700 dark:text-navy-200">
            Prix d'achat <span className="text-red-accent-500">*</span>
          </label>
          <InputText
            id="purchasePrice"
            type="number"
            step="0.01"
            className="w-full"
            {...register('purchasePrice', { required: true, valueAsNumber: true, min: { value: 0, message: '≥ 0' } })}
          />
          {errors.purchasePrice && <span className="text-xs text-red-accent-500">{errors.purchasePrice.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-navy-100 p-3 dark:border-navy-700">
        <label className={checkboxRowClassName}>
          <input type="checkbox" className="h-4 w-4 accent-sky-accent-500" {...register('isDefaultSaleUnit')} />
          Unité de vente par défaut pour cet article
        </label>
        <label className={checkboxRowClassName}>
          <input type="checkbox" className="h-4 w-4 accent-sky-accent-500" {...register('allowSale')} />
          Autoriser la vente dans cette unité
        </label>
        <label className={checkboxRowClassName}>
          <input type="checkbox" className="h-4 w-4 accent-sky-accent-500" {...register('allowPurchase')} />
          Autoriser l'achat dans cette unité
        </label>
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