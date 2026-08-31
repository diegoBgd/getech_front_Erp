import React from 'react';
import { Column } from 'primereact/column';
import { Button } from '@/components/ui/button';

import type { RubriqueFinanciere } from '@/services/rubrique.service';
import { CustomDataTable } from '@/components/ui/data-table';

interface TableProps {
  rubriques: RubriqueFinanciere[];
  onDelete: (id: number) => void;
}

export const RubriqueTable: React.FC<TableProps> = ({ rubriques, onDelete }) => {
  
  // 💡 GABARIT : Formate la nature comptable avec les badges ERP
  const natureTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
        rowData.nature === 'ACTIF' ? 'bg-emerald-50 text-emerald-700' :
        rowData.nature === 'PASSIF' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {rowData.nature}
      </span>
    );
  };

  // 💡 GABARIT : Formate la plage principale (Brut)
  const plagePrincipalTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className="font-mono text-emerald-700 font-black">
        {rowData.plageComptesPrincipal || '-'}
      </span>
    );
  };

  // 💡 GABARIT : Formate la plage corrective (Amortissement)
  const plageCorrectifTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className="font-mono text-rose-700 font-black">
        {rowData.plageComptesCorrectif || '-'}
      </span>
    );
  };

  // 💡 GABARIT : Formate la colonne d'action de suppression
  const actionTemplate = (rowData: RubriqueFinanciere) => {
    return rowData.id ? (
      <div className="text-center">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-rose-600  hover:bg-rose-50 rounded-md transition-colors" 
          onClick={() => onDelete(rowData.id!)}
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
      <Column 
        field="ordre" 
        header="Ordre" 
        className="font-bold text-navy-400 text-center w-[70px]" 
      />
      <Column 
        field="code" 
        header="Code" 
        className="font-mono font-bold text-navy-600 w-[80px]" 
      />
      <Column 
        field="intitule" 
        header="Intitulé Ligne" 
        className="  font-bold text-navy-900 dark:text-navy-50" 
      />
      <Column 
        header="Nature" 
        body={natureTemplate} 
        className="w-[100px] " 
      />
      <Column 
        field="modeCalcul" 
        header="Mode" 
        className="font-bold text-navy-500 w-[80px] " 
      />
      <Column 
        header="Plage Brut" 
        body={plagePrincipalTemplate} 
        className="w-[130px]" 
      />
      <Column 
        header="Plage Amort." 
        body={plageCorrectifTemplate} 
        className="w-[130px]" 
      />
      <Column 
        field="sensSoldeAdmis" 
        header="Solde " 
        className="text-[10px] text-navy-400   font-bold w-[80px]" 
      />
      <Column 
        header="Action" 
        body={actionTemplate} 
        className="text-center w-[80px]" 
      />
    </CustomDataTable>
  );
};
