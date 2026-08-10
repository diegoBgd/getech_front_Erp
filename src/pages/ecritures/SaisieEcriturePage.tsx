import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ecritureService } from '@/services/ecriture.service';
import type { PieceComptableSaisie } from '@/types';
import { SaisieEcritureForm } from '@/components/forms/SaisieEcritureForm';

export const SaisieEcriturePage: React.FC = () => {
  const [journaux, setJournaux] = useState<any[]>([]);
  const [exercices, setExercices] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const chargerDonneesConfiguration = async () => {
    setFetching(true);
    try {
      const [resJ, resE, resC] = await Promise.all([
        ecritureService.getJournaux(),
        ecritureService.getExercices(),
        ecritureService.getComptesDetail()
      ]);
      setJournaux(resJ.map(j => ({ label: `${j.code} - ${j.intitule}`, value: j.code })));
      setExercices(resE.map(e => ({ label: e.libelle, value: e.id })));
      setComptes(resC.map(c => ({ label: `${c.code} - ${c.intitule}`, value: c.code })));
    } catch (err) {
      console.error("Erreur de chargement des configurations", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    chargerDonneesConfiguration();
  }, []);

  const handleValidationPiece = async (data: PieceComptableSaisie) => {
    setLoading(true);
    try {
      await ecritureService.enregistrerPiece(data);
      alert("La pièce comptable a été enregistrée avec succès !");
    } catch (error: any) {
      const msg = error.response?.headers['x-error-message'] || "Erreur lors de la validation.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Saisie d'Écritures</h2>
          <p className="text-xs text-navy-400">Saisie des pièces en partie double</p>
        </div>

        <Divider className="my-4 border-navy-100" />

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" animationDuration=".8s" />
            <span className="text-xs text-navy-400">Chargement du dictionnaire comptable...</span>
          </div>
        ) : (
          <SaisieEcritureForm 
            journaux={journaux} exercices={exercices} comptes={comptes}
            loading={loading} onSubmit={handleValidationPiece} 
          />
        )}
      </div>
    </div>
  );
};
