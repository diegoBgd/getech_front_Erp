/**
 * Constantes globales de l'application.
 * Centralisées ici pour être facilement modifiables (rebranding, config env, ...).
 */
export const APP_NAME = 'Gatech ERP';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'Gatech Technology';
export const APP_YEAR = new Date().getFullYear();

export type AppEnvironment = 'Développement' | 'Test' | 'Production';

/** À terme, dérivé de import.meta.env.MODE / une variable d'environnement dédiée. */
export const APP_ENVIRONMENT: AppEnvironment = 'Développement';

/** Clé utilisée pour persister l'état réduit/étendu du Sidebar. */
export const SIDEBAR_STORAGE_KEY = 'waangu:sidebar-collapsed';
/** Clé utilisée pour persister le thème clair/sombre. */
export const THEME_STORAGE_KEY = 'waangu:theme';