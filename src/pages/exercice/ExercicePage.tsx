import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from '../../components/ui/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ModalConfirm } from '../../components/ui/modal-confirm';

import { ExerciceTable } from './ExerciceTable';
import type { Exercice } from '@/types/exercice.types';
import { exerciceService } from '@/services/exercice.service';
import { ExerciceForm } from '@/components/forms/ExerciceForm';


export const ExercicePage: React.FC = () => {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentExercice, setCurrentExercice] = useState<Exercice | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [idA_Supprimer, setIdA_Supprimer] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // 💡 UTILS : TRANSFORME YYYY-MM-DD EN DD/MM/YYYY
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const parties = dateStr.split('-');
    if (parties.length !== 3) return dateStr;
    return `${parties[2]}/${parties[1]}/${parties[0]}`;
  };

  const chargerExercices = async () => {
    setLoading(true);
    try {
      const data = await exerciceService.getAll();
      setExercices(data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerExercices();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <ModalConfirm
        visible={deleteModalVisible}
        title="Confirmation de suppression"
        message="Êtes-vous sûr de vouloir supprimer cet exercice comptable ? Cette action est définitive."
        onConfirm={async () => {
          if (!idA_Supprimer) return;
          setDeleteLoading(true);
          try {
            if (exerciceService.delete) await exerciceService.delete(idA_Supprimer);
            setDeleteModalVisible(false);
            chargerExercices();
          } catch (err) {
            console.error(err);
          } finally {
            setDeleteLoading(false);
          }
        }}
        onCancel={() => setDeleteModalVisible(false)}
        loading={deleteLoading}
      />

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Périodes & Exercices Comptables</h2>
          </div>
          <Button size="sm" onClick={() => { setCurrentExercice(null); setShowForm(true); }} className="font-bold uppercase text-xs h-[36px] px-4">
            <i className="pi pi-plus mr-2 text-xs"></i> Nouvel Exercice
          </Button>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {loading && exercices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <ProgressSpinner style={{ width: '32px' }} />
          </div>
        ) : (
          <ExerciceTable 
            exercices={exercices} 
            onEdit={(ex) => { setCurrentExercice(ex); setShowForm(true); }} 
            onDelete={(id) => { setIdA_Supprimer(id); setDeleteModalVisible(true); }} 
            formatDate={formatDate} // 💡 INJECTION DE LA METHODE DE FORMATAGE
          />
        )}

        <ExerciceForm visible={showForm} exerciceInitial={currentExercice} onSaveSuccess={() => { setShowForm(false); chargerExercices(); }} onCancel={() => setShowForm(false)} />
      </div>
    </div>
  );
};
