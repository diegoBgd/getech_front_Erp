import { useContext } from 'react';
import { SidebarContext } from '@/contexts/SidebarContext';

/** Accès typé au SidebarContext. Doit être utilisé sous <SidebarProvider>. */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar doit être utilisé à l\'intérieur de <SidebarProvider>');
  }
  return context;
}
