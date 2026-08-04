import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SIDEBAR_STORAGE_KEY } from '@/utils/constants';

interface SidebarContextValue {
  /** Sidebar réduit (icônes seules) sur desktop. */
  collapsed: boolean;
  /** Sidebar ouvert en overlay sur mobile/tablette. */
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const value = useMemo(
    () => ({ collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile }),
    [collapsed, mobileOpen, toggleCollapsed, toggleMobile, closeMobile],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
