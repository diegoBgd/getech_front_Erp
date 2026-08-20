import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Dialog } from 'primereact/dialog';
import type { Exercice, StatutExercice } from '@/types/exercice.types';
import { exerciceService } from '@/services/exercice.service';

interface ExerciceFormProps {
  visible: boolean; // 💡 Gère l'affichage de la popup
  exerciceInitial?: Exercice | null;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export const ExerciceForm: React.FC<ExerciceFormProps> = ({ 
  visible,
  exerciceInitial, 
  onSaveSuccess, 
  onCancel 
}) => {
  const [code, setCode] = useState<string>('');
  const [libelle, setLibelle] = useState<string>('');
  const [dateDebut, setDateDebut] = useState<string>('');
  const [dateFin, setDateFin] = useState<string>('');
  const [statut, setStatut] = useState<StatutExercice>('OUVERT');
  const [exercicePrecedentId, setExercicePrecedentId] = useState<number | string>(''); // Supporte "" pour le reset
  
  const [tousExercices, setTousExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const optionsStatut = [
    { label: 'Ouvert', value: 'OUVERT' },
    { label: 'Clôturé', value: 'CLOTURE' }
  ];

  // Chargement du référentiel
  useEffect(() => {
    if (!visible) return;
    const chargerReferentiel = async () => {
      try {
        const data = await exerciceService.getAll();
        const listeFiltrer = exerciceInitial?.id 
          ? data.filter(e => e.id !== exerciceInitial.id)
          : data;
        setTousExercices(listeFiltrer);
      } catch (err) {
        console.error("Erreur référentiel exercices", err);
      }
    };
    chargerReferentiel();
  }, [exerciceInitial, visible]);

  // Initialisation à l'ouverture de la popup
  useEffect(() => {
    if (visible && exerciceInitial) {
      setCode(exerciceInitial.code);
      setLibelle(exerciceInitial.libelle);
      setDateDebut(exerciceInitial.dateDebut);
      setDateFin(exerciceInitial.dateFin);
      setStatut(exerciceInitial.statut);
      setExercicePrecedentId(exerciceInitial.exercicePrecedentId || '');
    } else if (visible) {
      // Réinitialisation en cas de création neuve
      setCode('');
      setLibelle('');
      setDateDebut('');
      setDateFin('');
      setStatut('OUVERT');
      setExercicePrecedentId('');
    }
  }, [exerciceInitial, visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id: exerciceInitial?.id,
        code,
        libelle,
        dateDebut,
        dateFin,
        statut,
        // Conversion de la chaîne vide "" en null si aucun exercice n'est choisi
        exercicePrecedentId: exercicePrecedentId === '' ? null : Number(exercicePrecedentId)
      } as Exercice;

      await exerciceService.create(payload);
      onSaveSuccess();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement", err);
    } finally {
      setLoading(false);
    }
  };

  // Transformation des exercices pour correspondre au format exact attendu par votre <Select />
  const optionsPrecedent = [
    { label: 'Aucun (Premier exercice historique)', value: '' },
    ...tousExercices.map(ex => ({
      label: `${ex.libelle} (${ex.code})`,
      value: ex.id
    }))
  ];

  return (
    <Dialog 
      header={exerciceInitial ? "📝 Modifier l'exercice" : "✨ Nouvel exercice comptable"} 
      visible={visible} 
      style={{ width: '550px' }} 
      modal 
      onHide={onCancel}
      className="dark:bg-navy-900 border dark:border-navy-800 rounded-xl"
      contentClassName="p-6 bg-white dark:bg-navy-900"
      headerClassName="p-4 bg-navy-50/50 dark:bg-navy-800/40 border-b border-navy-100 dark:border-navy-800 text-sm font-bold text-navy-900 dark:text-navy-50 rounded-t-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-navy-400 dark:text-navy-500 mb-1">Code de l'exercice</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ex: 2026" required className="text-xs font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-navy-400 dark:text-navy-500 mb-1">Intitulé / Libellé</label>
            <Input value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="ex: Exercice Comptable 2026" required className="text-xs font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-navy-400 dark:text-navy-500 mb-1">Date de début</label>
            <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required className="text-xs font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-navy-400 dark:text-navy-500 mb-1">Date de fin</label>
            <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required className="text-xs font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-navy-400 dark:text-navy-500 mb-1">Statut Courant</label>
            <Select value={statut} options={optionsStatut} onChange={(e: any) => setStatut(e.value)} className="text-xs font-bold" />
          </div>
          
          {/* 💡 CORRECTION : Remplacement du Dropdown par votre Select UI ERP standardisé */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-navy-400 dark:text-navy-500 mb-1">Exercice Précédent (N-1)</label>
            <Select 
              value={exercicePrecedentId} 
              options={optionsPrecedent} 
              onChange={(e: any) => setExercicePrecedentId(e.value)} 
              className="text-xs font-bold" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-navy-50 dark:border-navy-800">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading} className="text-xs font-bold uppercase">
            Annuler
          </Button>
          <Button type="submit" size="sm" disabled={loading} className="text-xs font-bold uppercase px-4">
            {loading ? "Enregistrement..." : "Sauvegarder"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
