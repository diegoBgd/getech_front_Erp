import React from 'react';
import { Column } from 'primereact/column';
import { Button } from '@/components/ui/button';
import type { RubriqueFinanciere } from '@/services/rubrique.service';
import { CustomDataTable } from '@/components/ui/data-table';

interface TableProps {
  rubriques: RubriqueFinanciere[];
  onEdit: (rubrique: RubriqueFinanciere) => void; // 💡 AJOUT : Déclencheur pour charger le formulaire en édition
  onDelete: (id: number) => void;
}

export const RubriqueTable: React.FC<TableProps> = ({ rubriques, onEdit, onDelete }) => {
  
  const natureTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
        rowData.nature === 'ACTIF' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
        rowData.nature === 'PASSIF' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 
        rowData.nature === 'PRODUIT' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
        'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
      }`}>
        {rowData.nature}
      </span>
    );
  };

  const plagePrincipalTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-black text-[11px]">
        {rowData.plageComptesPrincipal || '-'}
      </span>
    );
  };

  const plageCorrectifTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className="font-mono text-rose-700 dark:text-rose-400 font-black text-[11px]">
        {rowData.plageComptesCorrectif || '-'}
      </span>
    );
  };

  // 💡 GABARIT COMPACTÉ CONTENANT LES DEUX ACTIONS SYSTÈME (MODIFIER + SUPPRIMER)
  const actionTemplate = (rowData: RubriqueFinanciere) => {
    return rowData.id ? (
      <div className="flex items-center justify-center gap-1">
        {/* Bouton de Modification */}
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-sky-accent-600 hover:bg-sky-accent-50 dark:hover:bg-sky-accent-950/30 rounded-md transition-colors" 
          onClick={() => onEdit(rowData)}
          title="Modifier cette rubrique"
        >
          <i className="pi pi-pencil text-[10px]"></i>
        </Button>

        {/* Bouton de Suppression */}
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors" 
          onClick={() => onDelete(rowData.id!)}
          title="Supprimer cette rubrique"
        >
          <i className="pi pi-trash text-[10px]"></i>
        </Button>
      </div>
    ) : null;
  };

  return (
    <CustomDataTable 
      value={rubriques} 
      emptyMessage="Aucune rubrique financière configurée pour cet état."
    >
      <Column field="ordre" header="Ordre" className="font-bold text-navy-400 text-center w-[70px]" />
      <Column field="code" header="Code" className="font-mono font-bold text-navy-600 dark:text-navy-400 w-[110px]" />
      <Column field="intitule" header="Intitulé Ligne du Rapport" className="font-bold text-navy-900 dark:text-navy-50" />
      <Column header="Nature" body={natureTemplate} className="w-[100px]" />
      <Column field="modeCalcul" header="Mode" className="font-bold text-navy-500 w-[90px]" />
      <Column header="Plage Brut" body={plagePrincipalTemplate} className="w-[130px]" />
      <Column header="Plage Amort." body={plageCorrectifTemplate} className="w-[130px]" />
      <Column field="sensSoldeAdmis" header="Solde" className="text-[10px] text-navy-400 font-bold w-[90px]" />
      <Column header="Actions" body={actionTemplate} className="text-center w-[90px]" />
    </CustomDataTable>
  );
};
