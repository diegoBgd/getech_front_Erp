import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { HomePage } from '@/pages/home/HomePage';
import { CategoriesPage } from '@/pages/products/categories/CategoriesPage';
import { UniteMesurePage } from '@/pages/products/unite_mesure/UniteMesurePage';
import { ConditionnementPage } from '@/pages/products/conditionnement/ConditionnementPage';

/**
 * Déclaration centralisée des routes. Le MainLayout englobe toutes les
 * pages (Sidebar/TopBar/BottomBar communs), chaque page n'affiche que
 * son propre contenu via <Outlet /> dans MainLayout.
 *
 * Pour ajouter une nouvelle page : créer le composant dans `pages/`,
 * l'importer ici, ajouter la route, puis ajouter l'entrée correspondante
 * dans `components/navigation/menuConfig.ts` et `routes/routesConfig.ts`.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'products/categories', element: <CategoriesPage /> },
      { path: 'products/unite_mesure', element: <UniteMesurePage /> },
      { path: 'products/conditionnement', element: <ConditionnementPage /> },
    ],
  },
]);
