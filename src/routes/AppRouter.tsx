import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { HomePage } from '@/pages/home/HomePage';
import { PlanComptablePage } from '@/pages/compta/compte/PlanComptablePage';
import { JournalPage } from '@/pages/compta/journal/JournalPage';
import { SaisieEcriturePage } from '@/pages/compta/ecritures/SaisieEcriturePage';
import { ExercicePage } from '@/pages/compta/exercice/ExercicePage';
import { ParametresPage } from '@/pages/compta/parametreod/ParametresPage';
import { GrandLivrePage } from '@/pages/compta/grandlivre/GrandLivrePage';
import { BalancePage } from '@/pages/balance/BalancePage';
import { RubriqueFinancierePage } from '@/pages/compta/rubrique/RubriqueFinancierePage';
import { BilanPage } from '@/pages/bilan/BilanPage';
import { CompteResultatPage } from '@/pages/compta/resultat/CompteResultatPage';
import { HistoriqueComptePage } from '@/pages/compta/movementcompte/HistoriqueComptePage';
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
      { path: 'compta/compte', element: <PlanComptablePage/> },
      { path: 'compta/journal', element: <JournalPage/> }, 
      { path: 'compta/ecritures', element: <SaisieEcriturePage/> }, 
      { path: 'compta/exercice', element: <ExercicePage/> }, 
      { path: 'compta/parametreod', element: <ParametresPage/> }, 
      { path: 'compta/grandlivre', element: <GrandLivrePage/> }, 
      { path: 'compta/balance', element: <BalancePage/> },
      { path: 'compta/rubrique', element: <RubriqueFinancierePage/> }, 
      { path: 'compta/bilan', element: <BilanPage/> }, 
      { path: 'compta/resultat', element: <CompteResultatPage/> }, 
      { path: 'compta/movementcompte', element: <HistoriqueComptePage/> }, 

    ],
  },
]);
