import React from 'react';
import { Column } from 'primereact/column';
import { Button } from '@/components/ui/button';
import type { RubriqueFinanciere } from '@/services/rubrique.service';
import { CustomDataTable } from '@/components/ui/data-table';

interface TableProps {
  rubriques: RubriqueFinanciere[];
  rubriqueEnEdition: RubriqueFinanciere | null;
  onEdit: (rubrique: RubriqueFinanciere) => void;
  onDelete: (id: number, code: string) => void;
}

export const RubriqueTable: React.FC<TableProps> = ({ rubriques, rubriqueEnEdition, onEdit, onDelete }) => {

  const natureTemplate = (rowData: RubriqueFinanciere) => {
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${rowData.nature === 'ACTIF' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
          rowData.nature === 'PASSIF' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
            rowData.nature === 'PRODUIT' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
              'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
        }`}>{rowData.nature}</span>
    );
  };

  // 💡 NETTOYAGE TYPOGRAPHIQUE : font-mono remplacé par font-sans antialiased sur les plages configurées (Zéro standard)
  const plagePrincipalTemplate = (rowData: RubriqueFinanciere) => {
    return <span className="font-sans antialiased text-emerald-700 dark:text-emerald-400 font-black text-[11px] tracking-wide">{rowData.plageComptesPrincipal || '-'}</span>;
  };

  const plageCorrectifTemplate = (rowData: RubriqueFinanciere) => {
    return <span className="font-sans antialiased text-rose-700 dark:text-rose-400 font-black text-[11px] tracking-wide">{rowData.plageComptesCorrectif || '-'}</span>;
  };

  const actionTemplate = (rowData: RubriqueFinanciere) => {
    const estEnCoursDEdition = rubriqueEnEdition && rubriqueEnEdition.id === rowData.id;

    return rowData.id ? (
      <div className="flex items-center justify-center gap-1">
        <Button type="button" variant={estEnCoursDEdition ? "default" : "ghost"} size="sm" className={`h-7 w-7 p-0 rounded-md transition-colors ${estEnCoursDEdition ? 'bg-sky-accent-500 text-white hover:bg-sky-accent-600' : 'text-sky-accent-600 hover:bg-sky-accent-50 dark:hover:bg-sky-accent-950/30'}`} onClick={() => onEdit(rowData)} title="Modifier cette rubrique"><i className="pi pi-pencil text-[10px]"></i></Button>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors" onClick={() => onDelete(rowData.id!, rowData.code || '')} title="Supprimer cette rubrique"><i className="pi pi-trash text-[10px]"></i></Button>
      </div>
    ) : null;
  };

  const rowClassName = (rowData: any) => {
    return rubriqueEnEdition && rubriqueEnEdition.id === rowData.id
      ? '!bg-sky-accent-50/40 dark:!bg-sky-accent-950/20 !font-bold border-l-4 border-l-sky-accent-500'
      : 'transition-colors';
  };

  return (
    <CustomDataTable value={rubriques} rowClassName={rowClassName} emptyMessage="Aucune rubrique financière configurée pour cet état." className="font-sans antialiased">
      <Column field="ordre" header="Ordre" className="font-bold text-navy-400 text-center w-[50px] font-sans" />
      {/* 💡 NETTOYAGE TYPOGRAPHIQUE : Le code technique généré (ex: BA_01, CRC_10) s'affiche de manière très fluide */}
      <Column field="code" header="Code" className="font-sans antialiased font-black text-sky-600 dark:text-sky-400 text-center w-[75px]" />
      <Column field="intitule" header="Rubriques" className="font-bold text-navy-900 dark:text-navy-50 w-[180px] font-sans" />
      <Column header="Nature" body={natureTemplate} className="w-[100px] font-sans" />
      <Column field="modeCalcul" header="Mode" className="font-bold text-navy-500 w-[90px] font-sans" />
      <Column header="Plage Brut" body={plagePrincipalTemplate} className="w-[130px] font-sans" />
      <Column header="Plage Amort." body={plageCorrectifTemplate} className="w-[130px] font-sans" />
      <Column field="sensSoldeAdmis" header="Solde" className="text-[10px] text-navy-400 font-bold w-[90px] font-sans" />
      <Column header="Actions" body={actionTemplate} className="text-center w-[80px] font-sans" />
    </CustomDataTable>
  );
};
