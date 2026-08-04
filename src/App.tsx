import { RouterProvider } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from '@/routes/AppRouter';

/**
 * Racine de l'application : assemble tous les Providers (PrimeReact, Thème,
 * Sidebar, Auth) puis délègue le rendu des pages à React Router.
 */

function App() {
 
  return (
    <PrimeReactProvider>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <RouterProvider router={router} />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  );
}

export default App;
