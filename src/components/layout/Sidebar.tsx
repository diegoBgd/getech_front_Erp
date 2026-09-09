import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import { useSidebar } from '@/hooks/useSidebar';
import { menuItems } from '@/components/navigation/menuConfig';
import { SidebarMenuList } from '@/components/navigation/SidebarMenuItem';
import { APP_NAME } from '@/utils/constants';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-navy-950/60 lg:hidden" onClick={closeMobile} aria-hidden />
      )}
      <Tooltip target="[data-pr-tooltip]" />
      
      {/* 💡 CORRECTION DU SIDEBAR : Ajout de overflow-x-hidden pour tuer la scrollbar horizontale lors de la réduction */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-screen flex-col bg-navy-900 text-white transition-all duration-300 ease-in-out overflow-x-hidden',
        collapsed ? 'lg:w-[76px]' : 'lg:w-64',
        mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0',
      )}>
        <div className={cn('flex h-16 shrink-0 items-center gap-3 border-b border-navy-800 px-4', collapsed && 'lg:justify-center lg:px-0')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-accent-500 font-bold text-white">G</div>
          {(!collapsed || mobileOpen) && <span className="truncate text-base font-semibold">{APP_NAME}</span>}
        </div>
        
        {/* 💡 CORRECTION DES LIENS : thin-scrollbar + overflow-x-hidden empêche tout glissement latéral */}
        <nav className="thin-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4 w-full">
          <SidebarMenuList items={menuItems} collapsed={collapsed && !mobileOpen} onNavigate={closeMobile} />
        </nav>
        
        <div className="border-t border-navy-800 px-4 py-3 text-center text-[11px] text-navy-500 shrink-0">
          {(!collapsed || mobileOpen) ? <span>v1.0.0 · Gatech Technology</span> : <span>v1.0</span>}
        </div>
      </aside>
    </>
  );
}
