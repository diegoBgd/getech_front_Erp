import { api } from "./api";

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/erp/compta/periodes`;

export interface PeriodeComptable {
  id: number;
  libellePeriode: string;
  dateDebut: string;
  dateFin: string;
  cloturee: boolean;
}

export const periodeService = {
  // 1. Récupère la liste des segments configurés pour l'exercice actif
  getPeriodesParExercice: async (exerciceId: number): Promise<PeriodeComptable[]> => {
    const res = await api.get(`${API_URL}/exercice/${exerciceId}`);
    return res.data;
  },

  // 2. 💡 AJOUT : Déclenche l'algorithme de découpage et de génération des périodes sur le serveur
  genererPeriodes: async (exerciceId: number, periodicite: string): Promise<void> => {
    // Émet la requête POST vers le contrôleur pour initialiser le pare-feu
    await api.post(`${API_URL}/generer/${exerciceId}`, null, {
      params: { periodicite }
    });
  },

  // 3. Bascule le verrou d'une période (Clôturer / Réouvrir)
  basculerVerrou: async (id: number, cloturer: boolean): Promise<void> => {
    await api.put(`${API_URL}/${id}/verrouiller`, null, {
      params: { cloturer }
    });
  }
};
