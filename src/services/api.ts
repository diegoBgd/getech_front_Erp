import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('waangu:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 💡 UNIQUE RÔLE DU RÉSEAU : Lever le drapeau de panne sans toucher au visuel HTML
    if (!error.response) {
      console.warn("Échec de liaison réseau détecté par l'intercepteur.");
      sessionStorage.setItem('gatech_v3_clear', 'true');
      window.dispatchEvent(new Event('erp:network_offline'));
      return Promise.reject(error);
    }

    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.removeItem('waangu:token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);
