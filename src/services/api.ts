import axios from 'axios';

/**
 * Instance Axios centralisée.
 *
 * Toute la configuration transverse (base URL, headers, intercepteurs
 * d'authentification, gestion globale des erreurs 401/403, ...) vit ici,
 * pour que les services métier (categoryService, etc.) restent simples.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Emplacement prévu pour l'intercepteur d'authentification (token JWT, refresh, ...).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('waangu:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Point d'extension unique pour la gestion globale des erreurs (toast, logout auto, ...).
    return Promise.reject(error);
  },
);
