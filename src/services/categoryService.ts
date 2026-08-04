
import { api } from './api';
import type { ProductCategory, ProductCategoryFormValues } from '@/types';
/**
 * Service "Catégories Produit".
 *
 * Les données sont actuellement simulées en mémoire (voir consigne du brief :
 * "Les données peuvent être simulées"). L'API publique (signatures async,
 * retour de Promise) est volontairement identique à ce qu'elle serait avec
 * `api` (axios) branché sur un vrai backend : il suffira de remplacer le
 * corps de chaque fonction par un appel `api.get/post/put/delete(...)`
 * sans toucher aux composants qui consomment ce service.
 */
const CATEGORIES_BASE = '/product-service/product-app/categories';


const simulateDelay = <T,>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function unwrapList(payload: unknown): ProductCategory[] {
  if (Array.isArray(payload)) return payload as ProductCategory[];
  const obj = payload as { data?: unknown; content?: unknown };
  if (Array.isArray(obj?.data)) return obj.data as ProductCategory[];
  if (Array.isArray(obj?.content)) return obj.content as ProductCategory[];
  console.warn('Forme de réponse inattendue pour la liste des catégories:', payload);
  return [];
}

function unwrapItem(payload: unknown): ProductCategory {
  const obj = payload as { data?: ProductCategory };
  return (obj?.data ?? payload) as ProductCategory;
}
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');


export const categoryService = {
async create(values: ProductCategoryFormValues): Promise<ProductCategory> {
  const response = await api.post(`${CATEGORIES_BASE}/create`, values);  // ← chemin POST
  return unwrapItem(response.data);
},
async update(id: string, values: ProductCategoryFormValues): Promise<ProductCategory> {
  const response = await api.put(`${CATEGORIES_BASE}/update/${id}`, values);  // ← À CONFIRMER
  return unwrapItem(response.data);
},
async getAll(): Promise<ProductCategory[]> {
  const response = await api.get(`${CATEGORIES_BASE}/all`);   // ← chemin GET
  return unwrapList(response.data);
},
async remove(id: string): Promise<void> {
  await api.delete(`${CATEGORIES_BASE}/delete/${id}`);  // ← À CONFIRMER
},
 /*
 
  async getAll(): Promise<ProductCategory[]> {
    return simulateDelay([...categories]);
  },
 async create(values: ProductCategoryFormValues): Promise<ProductCategory> {
    const newCategory: ProductCategory = {

      id: `cat-${Date.now()}`,
      slug: slugify(values.name),
      productCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      ...values,
    };
    categories = [newCategory, ...categories];
    return simulateDelay(newCategory);
  },

  async update(id: string, values: ProductCategoryFormValues): Promise<ProductCategory> {
    let updated: ProductCategory | undefined;
    categories = categories.map((category) => {
      if (category.id !== id) return category;
      updated = { ...category, ...values, slug: slugify(values.name) };
      return updated;
    });
    if (!updated) throw new Error('Catégorie introuvable');
    return simulateDelay(updated);
  },

  async remove(id: string): Promise<void> {
    categories = categories.filter((category) => category.id !== id);
    return simulateDelay(undefined);
  },*/
  


}
