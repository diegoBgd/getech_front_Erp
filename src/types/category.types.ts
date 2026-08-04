/**
 * Types liés au domaine "Catégories Produit".
 */
export interface ProductCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  slug: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Données du formulaire d'ajout/modification (sans champs calculés). */
export type ProductCategoryFormValues = Pick<
  ProductCategory,
 'code' |'name' | 'description' | 'status'
>;
