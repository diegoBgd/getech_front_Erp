import { createContext, useMemo, useState, type ReactNode } from 'react';
import type { ConnectedUser, User } from '@/types';

interface AuthContextValue {
  user: User;
  connectedUsers: ConnectedUser[];
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Utilisateur simulé pour la démo. À remplacer par un appel à `services/authService`
 * une fois l'API réelle branchée (voir services/api.ts).
 */
const MOCK_USER: User = {
  id: 'usr-1',
  firstName: 'Alice',
  lastName: 'Nkurunziza',
  fullName: 'Alice Nkurunziza',
  jobTitle: 'Administrateur système',
  email: 'alice.nkurunziza@waangu-erp.com',
  role: 'admin',
};

const MOCK_CONNECTED_USERS: ConnectedUser[] = [
  { id: 'usr-2', fullName: 'Jean Havyarimana', connectedSince: '09:12' },
  { id: 'usr-3', fullName: 'Paul Ndayishimiye', connectedSince: '09:40' },
  { id: 'usr-4', fullName: 'Marie Iradukunda', connectedSince: '10:02' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(MOCK_USER);
  const [connectedUsers] = useState<ConnectedUser[]>(MOCK_CONNECTED_USERS);

  const logout = () => {
    // Emplacement prévu pour l'appel API de déconnexion + redirection /login.
    console.info('Déconnexion demandée');
  };

  const value = useMemo(() => ({ user, connectedUsers, logout }), [user, connectedUsers]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
