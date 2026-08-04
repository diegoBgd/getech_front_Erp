import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { MenuItem } from '@/types';
import { cn } from '@/utils/cn';

interface SidebarMenuListProps {
  items: MenuItem[];
  collapsed: boolean;
  depth?: number;
  onNavigate?: () => void;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  collapsed: boolean;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

/**
 * Détermine si un item (ou un de ses enfants, récursivement) correspond
 * à la route active, pour ouvrir automatiquement le bon sous-menu au chargement.
 */
function containsActivePath(item: MenuItem, pathname: string): boolean {
  if (item.path && item.path === pathname) return true;
  return item.children?.some((child) => containsActivePath(child, pathname)) ?? false;
}

/**
 * Liste de menus "frères" partageant un seul état d'ouverture : ouvrir un
 * item ferme automatiquement les autres (comportement accordéon classique).
 * Chaque sous-niveau (enfants d'un item) instancie sa propre SidebarMenuList,
 * ce qui applique la même règle récursivement à chaque profondeur.
 */
export function SidebarMenuList({ items, collapsed, depth = 0, onNavigate }: SidebarMenuListProps) {
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(() => {
    const activeItem = items.find((item) => containsActivePath(item, location.pathname));
    return activeItem?.id ?? null;
  });

  return (
    <div className={depth === 0 ? 'space-y-1' : 'mt-1 flex flex-col gap-1'}>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.id}
          item={item}
          collapsed={collapsed}
          depth={depth}
          isOpen={openId === item.id}
          onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

function SidebarMenuItem({ item, collapsed, depth, isOpen, onToggle, onNavigate }: SidebarMenuItemProps) {
  const location = useLocation();
  const isActiveBranch = containsActivePath(item, location.pathname);
  const hasChildren = !!item.children?.length;

  const tooltipProps: { 'data-pr-tooltip'?: string; 'data-pr-position'?: 'right' } =
    collapsed && depth === 0 ? { 'data-pr-tooltip': item.label, 'data-pr-position': 'right' } : {};

  // --- Item "feuille" : lien direct vers une route ---
  if (!hasChildren) {
    return (
      <NavLink
        to={item.path ?? '#'}
        onClick={onNavigate}
        {...tooltipProps}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            depth > 0 && 'ml-2 border-l border-navy-700/40 pl-4',
            isActive
              ? 'bg-sky-accent-500/15 text-sky-accent-400'
              : 'text-navy-200 hover:bg-navy-700/60 hover:text-white',
            collapsed && depth === 0 && 'justify-center px-0',
          )
        }
      >
        <i className={cn(item.icon, 'text-base shrink-0')} aria-hidden />
        {(!collapsed || depth > 0) && <span className="truncate">{item.label}</span>}
      </NavLink>
    );
  }

  // --- Item "conteneur" en mode réduit : sous-menus dans un panneau flottant au survol ---
  if (collapsed && depth === 0) {
    return (
      <div className="group relative">
        <button
          type="button"
          {...tooltipProps}
          className={cn(
            'flex w-full items-center justify-center rounded-lg px-0 py-2 text-sm font-medium text-navy-200 transition-colors hover:bg-navy-700/60 hover:text-white',
            isActiveBranch && 'text-sky-accent-400',
          )}
        >
          <i className={cn(item.icon, 'text-base shrink-0')} aria-hidden />
        </button>
        <div className="invisible absolute left-full top-0 z-20 ml-2 w-52 rounded-lg border border-navy-700 bg-navy-800 py-2 opacity-0 shadow-xl transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">{item.label}</p>
          <div className="flex flex-col gap-1 px-2">
            {item.children!.map((child) => (
              <NavLink
                key={child.id}
                to={child.path ?? '#'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                    isActive ? 'bg-sky-accent-500/15 text-sky-accent-400' : 'text-navy-200 hover:bg-navy-700/60 hover:text-white',
                  )
                }
              >
                <i className={cn(child.icon, 'text-sm')} aria-hidden />
                <span className="truncate">{child.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Item "conteneur" : fonctionne comme un accordéon (ouverture contrôlée par le parent) ---
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-navy-200 transition-colors hover:bg-navy-700/60 hover:text-white',
          isActiveBranch && !isOpen && 'text-sky-accent-400',
        )}
        aria-expanded={isOpen}
      >
        <i className={cn(item.icon, 'text-base shrink-0')} aria-hidden />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <i className={cn('pi pi-chevron-down text-xs transition-transform', isOpen && 'rotate-180')} aria-hidden />
      </button>

      {/* Sous-menu façon accordéon : un seul sous-menu (à ce niveau) ouvert à la fois */}
      <div
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <SidebarMenuList items={item.children!} collapsed={collapsed} depth={depth + 1} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
