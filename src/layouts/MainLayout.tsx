import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomBar } from '@/components/layout/BottomBar';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/utils/cn';

/**
 * Layout principal englobant toutes les pages de l'application.
 *
 * Structure en hauteur fixe (h-screen) : le Sidebar occupe toute la hauteur
 * de l'écran (position fixed), la TopBar et la BottomBar restent immobiles,
 * et seul le contenu de <main> défile (overflow-y-auto) quand il dépasse
 * la hauteur disponible.
 */
export function MainLayout() {
  const { collapsed } = useSidebar();

  return (
    <div className="h-screen overflow-hidden bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      {/* Décalage à gauche égal à la largeur du Sidebar (desktop uniquement, le Sidebar étant fixed) */}
      <div
        className={cn(
          'flex h-screen flex-col transition-[margin-left] duration-300 ease-in-out',
          collapsed ? 'lg:ml-[76px]' : 'lg:ml-64',
        )}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
        <BottomBar />
      </div>
    </div>
  );
}
