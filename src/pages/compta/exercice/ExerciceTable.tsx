import React from 'react';
import { Column } from 'primereact/column';
import { Button } from '../../../components/ui/button';

import type { Exercice } from '@/types/exercice.types';
import { CustomDataTable } from '@/components/ui/data-table';

interface ExerciceTableProps {
  exercices: Exercice[];
  onEdit: (ex: Exercice) => void;
  onDelete: (id: number) => void;
  formatDate: (dateStr: string) => string;
}

export const ExerciceTable: React.FC<ExerciceTableProps> = ({ 
  exercices, 
  onEdit, 
  onDelete,
  formatDate
}) => {
  
  // Style des statuts conforme aux standards de l'ERP
  const getBadgeClass = (statut: string) => {
    if (statut === 'OUVERT') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
  };

  //  GABARIT : Formate la cellule de la période comptable
  const periodeTemplate = (rowData: Exercice) => {
    return (
      <span className="font-mono text-navy-600 dark:text-navy-400">
        Du {formatDate(rowData.dateDebut)} au {formatDate(rowData.dateFin)}
      </span>
    );
  };

  // GABARIT : Affiche le badge de statut
  const statutTemplate = (rowData: Exercice) => {
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeClass(rowData.statut)}`}>
        {rowData.statut}
      </span>
    );
  };

  //  GABARIT : Affiche la filiation de l'exercice précédent
  const anterioriteTemplate = (rowData: Exercice) => {
    if (rowData.exercicePrecedentLibelle) {
      return (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-bold text-[11px]">
          <i className="pi pi-link text-[10px]"></i> {rowData.exercicePrecedentLibelle}
        </span>
      );
    }
    return <span className="text-navy-400 dark:text-navy-500 text-[11px] italic">Premier exercice</span>;
  };

  //  GABARIT : Colonne d'actions éditrice et destructive
  const actionsTemplate = (rowData: Exercice) => {
    return (
      <div  className="flex gap-1 justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(rowData)} title="Modifier"
          className="h-8 w-8 p-0 text-sky-accent-500 rounded-full cursor-pointer"
        >
          <i className="pi pi-pencil text-[9px] mr-1"></i> 
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(rowData.id)} 
         type="button" 
          className="h-8 w-8 p-0 text-red-accent-500 rounded-full cursor-pointer"
        >
          <i className="pi pi-trash text-[9px] mr-1"></i> 
        </Button>
      </div>
    );
  };

  return (
    <CustomDataTable 
      value={exercices} 
      emptyMessage="Aucun exercice comptable paramétré dans le système"
    >
      <Column 
        field="code" 
        header="Code" 
        className="font-bold text-navy-900 dark:text-navy-50 w-[90px] text-center" 
      />
      <Column 
        field="libelle" 
        header="Libellé de l'Exercice" 
        className="font-semibold text-navy-800 dark:text-navy-200" 
      />
      <Column 
        header="Période Comptable" 
        body={periodeTemplate} 
        className="w-[220px]" 
      />
      <Column 
        header="Statut" 
        body={statutTemplate} 
        className="w-[110px] text-center" 
      />
      <Column 
        header="Exercice (N-1)" 
        body={anterioriteTemplate} 
        className="w-[200px]" 
      />
      <Column 
        header="Actions" 
        body={actionsTemplate} 
        className="text-center w-[100px]" 
      />
    </CustomDataTable>
  );
};
