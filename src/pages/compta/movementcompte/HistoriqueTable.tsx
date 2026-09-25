import React from 'react';
import { Column } from 'primereact/column';
import type { LigneHistoriqueCompteDto } from '@/services/historique.service';
import { CustomDataTable } from '@/components/ui/data-table';

interface HistoriqueTableProps {
  lignes: LigneHistoriqueCompteDto[];
  formatDate: (dateStr: string) => string;
  formatMontant: (valeur: number) => string;
}

export const HistoriqueTable: React.FC<HistoriqueTableProps> = ({ lignes, formatDate, formatMontant }) => {
  return (
    <CustomDataTable value={lignes} className="font-sans antialiased">
      {/* 💡 NETTOYAGE : font-mono purgé au profit de font-sans antialiased pour lisser les chiffres */}
      <Column 
        field="datePiece" 
        header="Date" 
        body={(r) => formatDate(r.datePiece)} 
        className="font-sans antialiased text-center w-[100px] text-slate-500 font-semibold" 
      />
      <Column 
        field="numeroPiece" 
        header="N° Pièce" 
        className="font-bold text-sky-600 font-sans antialiased text-center w-[130px]" 
      />
      <Column 
        field="codeJournal" 
        header="Jnl" 
        className="text-center w-[60px] font-bold font-sans uppercase" 
      />
      <Column 
        field="libelleEcriture" 
        header="Libellé de l'écriture / Désignation" 
        className="uppercase font-medium font-sans text-navy-800 dark:text-navy-100" 
      />
      <Column 
        field="debit" 
        header="Débit" 
        body={(r) => formatMontant(r.debit)} 
        className="text-right font-sans antialiased text-emerald-700 dark:text-emerald-400 font-black w-[130px]" 
      />
      <Column 
        field="credit" 
        header="Crédit" 
        body={(r) => formatMontant(r.credit)} 
        className="text-right font-sans antialiased text-rose-700 dark:text-rose-400 font-black w-[130px]" 
      />
      <Column 
        field="soldeProgressif" 
        header="Solde Glissant" 
        body={(r) => formatMontant(r.soldeProgressif)} 
        className="text-right font-sans antialiased text-navy-950 dark:text-navy-50 font-black bg-navy-50/20 w-[140px]" 
      />
    </CustomDataTable>
  );
};
