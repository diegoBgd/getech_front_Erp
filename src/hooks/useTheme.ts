import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

/** Accès typé au ThemeContext. Doit être utilisé sous <ThemeProvider>. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de <ThemeProvider>');
  }
  return context;
}
