/**
 * Types liés à la navigation (Sidebar).
 *
 * Un `MenuItem` représente une entrée du menu principal. Il peut soit
 * pointer directement vers une route (`path` défini), soit servir de
 * conteneur "accordéon" pour des `children` (sous-menus).
 */
export interface MenuItem {
  /** Identifiant unique, utilisé comme clé React et pour l'état ouvert/fermé de l'accordéon. */
  id: string;
  /** Libellé affiché dans le Sidebar. */
  label: string;
  /** Nom d'icône PrimeIcons (ex: "pi pi-home"). */
  icon: string;
  /** Route associée. Absent si l'item ne fait qu'ouvrir un sous-menu. */
  path?: string;
  /** Sous-menus (fonctionnement accordéon). */
  children?: MenuItem[];
  /** Badge optionnel (ex: nombre de notifications sur un menu). */
  badge?: string | number;
}
