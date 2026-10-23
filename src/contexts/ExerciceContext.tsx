import React, { createContext, useContext, useState, useEffect } from 'react';
import { exerciceService } from '@/services/exercice.service';
import type { Exercice } from '@/types/exercice.types';

// 💡 INTERFACE ENRICHIE POUR ASSURER LA COMPATIBILITÉ AVEC LE COMPOSANT SELECT UI
export interface ExerciceSelectOption extends Exercice {
  label: string;
  value: string;
}

interface ExerciceContextType {
  exerciceId: string | null;
  setExerciceId: (id: string | null) => void;
  exercicesOptions: ExerciceSelectOption[];
  exerciceActif: ExerciceSelectOption | null;
  loadingContext: boolean;
}

const ExerciceContext = createContext<ExerciceContextType | undefined>(undefined);

export const ExerciceGlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exerciceId, setExerciceId] = useState<string | null>(null);
  const [exercicesOptions, setExercicesOptions] = useState<ExerciceSelectOption[]>([]);
  const [loadingContext, setLoadingContext] = useState<boolean>(true);

  const chargerTousLesExercices = async () => {
    setLoadingContext(true);
    try {
      // 💡 EXTRACT GLOBALE : On charge absolument tous les exercices de l'ERP
      const data = await exerciceService.getAll();
      
      // Mappage rigoureux pour alimenter le Dropdown/Select sans masquer les exercices clos
      const optionsFormatees: ExerciceSelectOption[] = (data || []).map(e => ({
        ...e,
        value: String(e.id),
        // Le libellé affiche explicitement le statut pour informer le Directeur Financier
        label: `${e.libelle} - [${e.statut}]`
      }));

      setExercicesOptions(optionsFormatees);
      
      // Sélection intelligente par défaut à l'ouverture de la session
      if (optionsFormatees.length > 0) {
        const ouvert = optionsFormatees.find(e => e.statut === 'OUVERT');
        // On se positionne sur l'exercice ouvert prioritairement, sinon sur le premier trouvé
        setExerciceId(ouvert ? ouvert.value : optionsFormatees[0].value);
      }
    } catch (err) {
      console.error("Erreur de synchronisation du contexte d'exercice", err);
    } finally {
      setLoadingContext(false);
    }
  };

  useEffect(() => { chargerTousLesExercices(); }, []);

  // 💡 LECTURE DYNAMIQUE AU CLIC : Récupère l'exercice choisi par l'utilisateur
  const exerciceActif = exercicesOptions.find(e => e.value === exerciceId) || null;

  return (
    <ExerciceContext.Provider value={{ exerciceId, setExerciceId, exercicesOptions, exerciceActif, loadingContext }}>
      {children}
    </ExerciceContext.Provider>
  );
};

export const useExerciceGlobal = () => {
  const context = useContext(ExerciceContext);
  if (!context) throw new Error("useExerciceGlobal doit être enveloppé dans un ExerciceGlobalProvider");
  return context;
};
