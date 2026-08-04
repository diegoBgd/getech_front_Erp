export interface Conditionnement {
  id: number;
  itemId: number;
  unitId: number;
  conversionFactor: number;
  barcode: string;
  salePrice: number;
  purchasePrice: number;
  isDefaultSaleUnit: boolean;
  allowPurchase: boolean;
  allowSale: boolean;
}
 
/** Données du formulaire d'ajout/modification (id généré côté backend). */
export type ConditionnementFormValues = Pick<
  Conditionnement,
  | 'itemId'
  | 'unitId'
  | 'conversionFactor'
  | 'barcode'
  | 'salePrice'
  | 'purchasePrice'
  | 'isDefaultSaleUnit'
  | 'allowPurchase'
  | 'allowSale'
>;