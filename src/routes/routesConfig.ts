/**
 * Table de correspondance route -> titre de page.
 * Utilisée par la TopBar pour afficher le titre de la page courante
 * sans dupliquer cette information dans chaque composant de page.
 */
export const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/home': 'Accueil',
  '/products/categories': 'Catégories Produit',
  '/products/unite_mesure': 'Unités de Mesure',
  '/products/condtionnement': 'Condtionnement',
};

export function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? 'GATECH ERP';
}
