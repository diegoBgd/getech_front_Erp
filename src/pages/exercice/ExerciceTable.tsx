import React from 'react';
import { Button } from '../../components/ui/button';
import type { Exercice } from '@/types/exercice.types';


interface ExerciceTableProps {
  exercices: Exercice[];
  onEdit: (ex: Exercice) => void;
  onDelete: (id: number) => void;
  formatDate: (dateStr: string) => string; // 💡 AJOUT PROPS
}

export const ExerciceTable: React.FC<ExerciceTableProps> = ({ 
  exercices, 
  onEdit, 
  onDelete,
  formatDate
}) => {
  
  const getBadgeClass = (statut: string) => {
    if (statut === 'OUVERT') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="border border-navy-100 dark:border-navy-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-navy-950">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-50/50 dark:bg-navy-900/40 border-b border-navy-100 dark:border-navy-800 text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
              <th className="p-3 pl-4">Code</th>
              <th className="p-3">Libellé de l'Exercice</th>
              <th className="p-3">Période Comptable</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-emerald-600 dark:text-emerald-400">Antériorité (N-1)</th>
              <th className="p-3 pr-4 text-center w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-xs text-navy-700 dark:text-navy-300">
            {exercices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-navy-400">Aucun exercice comptable paramétré.</td>
              </tr>
            ) : (
              exercices.map((ex) => (
                <tr key={ex.id} className="hover:bg-navy-50/10 dark:hover:bg-navy-800/10">
                  <td className="p-3 pl-4 font-bold text-navy-900 dark:text-navy-50">{ex.code}</td>
                  <td className="p-3 font-semibold">{ex.libelle}</td>
                  {/* 💡 APPLICATION FORMAT dd/mm/yyyy */}
                  <td className="p-3 font-mono text-navy-500">
                    Du {formatDate(ex.dateDebut)} au {formatDate(ex.dateFin)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeClass(ex.statut)}`}>
                      {ex.statut}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-navy-400 dark:text-navy-500">
                    {ex.exercicePrecedentLibelle ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 text-[11px]">
                        <i className="pi pi-link text-[10px]"></i> {ex.exercicePrecedentLibelle}
                      </span>
                    ) : (
                      <span className="text-navy-300 text-[11px] italic">Premier exercice</span>
                    )}
                  </td>
                  <td className="p-3 pr-4 text-center flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(ex)} className="h-[28px] text-[10px] uppercase font-bold">
                      <i className="pi pi-pencil text-[9px] mr-1"></i> Éditer
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(ex.id)} className="h-[28px] text-[10px] uppercase font-bold border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                      <i className="pi pi-trash text-[9px] mr-1"></i> Supprimer
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
