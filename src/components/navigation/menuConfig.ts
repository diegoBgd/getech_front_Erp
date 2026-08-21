import type { MenuItem } from '@/types';

/**
 * Configuration déclarative du menu principal du Sidebar.
 *
 * Centraliser la structure ici permet d'ajouter/retirer un menu ou un
 * sous-menu sans toucher au composant Sidebar lui-même (Open/Closed Principle).
 */
export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'pi pi-chart-line',
    path: '/',
  },
  {
    id: 'home',
    label: 'Accueil',
    icon: 'pi pi-home',
    path: '/home',
  },
  {
    id: 'parametre',
    label: 'Paramètres',
    icon: 'pi pi-cog',
    children: [
      { id: 'compta-exercice', label: 'Exercice comptable', icon: 'pi pi-calendar', path: '/compta/exercice' },
      { id: 'compta-parametreod', label: 'Paramètres specifiques', icon: 'pi pi-share-alt', path: '/compta/parametreod' },
      { id: 'compta-rubrique', label: 'Paramètres rubrique', icon: 'pi pi-palette', path: '/compta/rubrique' }
      
    ],
  },
  {
    id: 'compta',
    label: 'Comptabilité',
    icon: 'pi pi-calculator',
    children: [
      { id: 'compta-plancomptable', label: 'Plan comptable', icon: 'pi pi-sitemap', path: '/compta/compte' },
      { id: 'compta-journal', label: 'Journal', icon: 'pi pi-folder', path: '/compta/journal' },
      { id: 'compta-ecriture', label: 'Saisie des écritures', icon: 'pi pi-file-edit', path: '/compta/ecritures' },
      { id: 'compta-grandlivre', label: 'Grand livre', icon: 'pi pi-book', path: '/compta/grandlivre' },
      { id: 'compta-balance', label: 'Balance', icon: 'pi pi-percentage', path: '/compta/balance' },
      { id: 'compta-bilan', label: 'Bilan', icon: 'pi pi-book', path: '/compta/bilan' },
      { id: 'compta-resultat', label: 'Compte resultat', icon: 'pi pi-inbox', path: '/compta/resultat' }
      
    ],
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'pi pi-users',
    children: [
      { id: 'clients-list', label: 'Liste des clients', icon: 'pi pi-address-book', path: '/clients/list' },
      { id: 'clients-groups', label: 'Groupes clients', icon: 'pi pi-sitemap', path: '/clients/groups' },
    ],
  },
  {
    id: 'purchases',
    label: 'Achats',
    icon: 'pi pi-cart-plus',
    children: [
      { id: 'purchases-orders', label: 'Bons de commande', icon: 'pi pi-file', path: '/purchases/orders' },
      { id: 'purchases-suppliers', label: 'Fournisseurs', icon: 'pi pi-truck', path: '/purchases/suppliers' },
    ],
  },
  {
    id: 'stock',
    label: 'Stock',
    icon: 'pi pi-warehouse',
    children: [
      { id: 'stock-inventory', label: 'Inventaire', icon: 'pi pi-list-check', path: '/stock/inventory' },
      { id: 'stock-movements', label: 'Mouvements', icon: 'pi pi-arrow-right-arrow-left', path: '/stock/movements' },
    ],
  },
  {
    id: 'accounting',
    label: 'Comptabilité',
    icon: 'pi pi-wallet',
    children: [
      { id: 'accounting-invoices', label: 'Factures', icon: 'pi pi-receipt', path: '/accounting/invoices' },
      { id: 'accounting-payments', label: 'Règlements', icon: 'pi pi-credit-card', path: '/accounting/payments' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: 'pi pi-sliders-h',
    children: [
      { id: 'admin-users', label: 'Utilisateurs', icon: 'pi pi-user', path: '/administration/users' },
      { id: 'admin-roles', label: 'Rôles & permissions', icon: 'pi pi-shield', path: '/administration/roles' },
      { id: 'admin-logs', label: "Journaux d'activité", icon: 'pi pi-history', path: '/administration/logs' },
    ],
  },
];
