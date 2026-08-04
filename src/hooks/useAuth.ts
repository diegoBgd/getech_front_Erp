import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/** Accès typé à l'AuthContext. Doit être utilisé sous <AuthProvider>. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>');
  }
  return context;
}
