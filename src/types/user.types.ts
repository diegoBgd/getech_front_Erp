/**
 * Types liés à l'utilisateur connecté et à l'authentification.
 */
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

/** Représente un utilisateur actuellement connecté au système (vue Admin). */
export interface ConnectedUser {
  id: string;
  fullName: string;
  avatarUrl?: string;
  connectedSince: string;
}
