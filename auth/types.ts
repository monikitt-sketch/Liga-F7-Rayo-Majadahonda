

export type Permission = 'manage_teams' | 'manage_matches' | 'manage_results' | 'manage_users';

export const ALL_PERMISSIONS: Permission[] = ['manage_teams', 'manage_matches', 'manage_results', 'manage_users'];

export const PERMISSION_LABELS: Record<Permission, string> = {
    manage_teams: 'Gestionar Equipos/Jugadores',
    manage_matches: 'Gestionar Calendario',
    manage_results: 'Gestionar Resultados',
    manage_users: 'Gestionar Usuarios',
};

export interface User {
  id: string;
  username: string;
  // FIX: Corrected typo in property definition from 'password; string' to 'password: string'.
  password: string; // In a real app, this would be a hash
  permissions: Permission[];
}