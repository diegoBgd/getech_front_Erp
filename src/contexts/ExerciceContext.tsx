import React, { createContext, useContext, useState, useEffect } from 'react';

import { exerciceService } from '@/services/exercice.service';

interface ExerciceOption {
  label: string;
  value: number;
}

interface ExerciceContextType {
  exerciceId: number | null;
  setExerciceId: (id: number | null) => void;
  exercicesOptions: ExerciceOption[];
  loadingExercices: boolean;
}

const ExerciceContext = createContext<ExerciceContextType | undefined>(undefined);

export const ExerciceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exerciceId, setExerciceId] = useState<number | null>(null);
  const [exercicesOptions, setExercicesOptions] = useState<ExerciceOption[]>([]);
  const [loadingExercices, setLoadingExercices] = useState<boolean>(true);

  useEffect(() => {
    const initialiserExerciceGlobal = async () => {
      try {
        const list = await exerciceService.getOuvert();
        const options = list.map((e: any) => ({
          label: `${e.code} : ${e.libelle || 'Exercice'}`,
          value: e.id
        }));
        setExercicesOptions(options);
        
        // Sélection automatique du premier exercice disponible par défaut
        if (options.length > 0) {
          setExerciceId(options[0].value);
        }
      } catch (err) {
        console.error("Erreur d'initialisation de l'exercice global", err);
      } finally {
        setLoadingExercices(false);
      }
    };
    initialiserExerciceGlobal();
  }, []);

  return (
    <ExerciceContext.Provider value={{ exerciceId, setExerciceId, exercicesOptions, loadingExercices }}>
      {children}
    </ExerciceContext.Provider>
  );
};

export const useExerciceGlobal = () => {
  const context = useContext(ExerciceContext);
  if (!context) throw new Error("useExerciceGlobal doit être enveloppé dans un ExerciceProvider");
  return context;
};
