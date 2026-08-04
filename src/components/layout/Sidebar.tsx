import { Tooltip } from 'primereact/tooltip';
import { useSidebar } from '@/hooks/useSidebar';
import { menuItems } from '@/components/navigation/menuConfig';
import { SidebarMenuList } from '@/components/navigation/SidebarMenuItem';
import { APP_NAME } from '@/utils/constants';
import { cn } from '@/utils/cn';

/**
 * Sidebar principal : logo + navigation. Rendu unique, utilisé à la fois
 * en desktop (colonne fixe, réductible) et en mobile (panneau overlay).
 */
export function Sidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Overlay sombre en mobile, ferme le Sidebar au clic à l'extérieur */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-navy-950/60 lg:hidden" onClick={closeMobile} aria-hidden />
      )}

      <Tooltip target="[data-pr-tooltip]" />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen flex-col bg-navy-900 text-white transition-all duration-300 ease-in-out',
          collapsed ? 'lg:w-[76px]' : 'lg:w-64',
          mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo + nom de l'application */}
        <div className={cn('flex h-16 shrink-0 items-center gap-3 border-b border-navy-800 px-4', collapsed && 'lg:justify-center lg:px-0')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-accent-500 font-bold text-white">
            G
          </div>
          {(!collapsed || mobileOpen) && <span className="truncate text-base font-semibold">{APP_NAME}</span>}
        </div>

        {/* Navigation principale, scrollable si nombreux menus */}
        <nav className="thin-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-visible px-3 py-4">
          <SidebarMenuList items={menuItems} collapsed={collapsed && !mobileOpen} onNavigate={closeMobile} />
        </nav>

        <div className="border-t border-navy-800 px-4 py-3 text-center text-[11px] text-navy-500">
          {(!collapsed || mobileOpen) && <span>v1.0.0 · Gatech Technology</span>}
        </div>
      </aside>
    </>
  );
}
