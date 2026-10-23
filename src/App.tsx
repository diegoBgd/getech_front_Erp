import { RouterProvider } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ExerciceGlobalProvider } from '@/contexts/ExerciceContext';
import { router } from '@/routes/AppRouter';


/**
 * Racine de l'application : assemble tous les Providers (PrimeReact, Thème,
 * Sidebar, Auth, Exercice) puis délègue le rendu des pages à React Router.
 */
function App() {
  return (
    <PrimeReactProvider>
     
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            {/* 💡 INTÉGRATION DE L'EXERCICE PROVIDER GLOBAL */}
             <ExerciceGlobalProvider>
              <RouterProvider router={router} />
             </ExerciceGlobalProvider>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  );
}

export default App;
