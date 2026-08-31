import React from 'react';
import { Column } from 'primereact/column';
import type { LigneHistoriqueCompteDto } from '@/services/historique.service';
import { CustomDataTable } from '@/components/ui/data-table';

interface HistoriqueTableProps {
  lignes: LigneHistoriqueCompteDto[];
  formatDate: (dateStr: string) => string;
  formatMontant: (valeur: number) => string;
}

export const HistoriqueTable: React.FC<HistoriqueTableProps> = ({
  lignes,
  formatDate,
  formatMontant
}) => {
  return (
    <CustomDataTable value={lignes}>
      <Column 
        field="datePiece" 
        header="Date" 
        body={(r) => formatDate(r.datePiece)} 
        className="font-mono text-center w-[80px]" 
      />
      <Column 
        field="numeroPiece" 
        header="N° Pièce" 
        className="font-bold text-navy-600 font-mono w-[120px]" 
      />
      <Column 
        field="codeJournal" 
        header="Jnl" 
        className="text-center w-[60px] font-bold" 
      />
      <Column 
        field="libelleEcriture" 
        header="Libellé de l'écriture / Désignation" 
        className="uppercase font-medium" 
      />
      <Column 
        field="debit" 
        header="Débit" 
        body={(r) => formatMontant(r.debit)} 
        className="text-right font-mono text-emerald-700 dark:text-emerald-400 font-bold w-[130px]" 
      />
      <Column 
        field="credit" 
        header="Crédit" 
        body={(r) => formatMontant(r.credit)} 
        className="text-right font-mono text-rose-700 dark:text-rose-400 font-bold w-[130px]" 
      />
      <Column 
        field="soldeProgressif" 
        header="Solde Glissant" 
        body={(r) => formatMontant(r.soldeProgressif)} 
        className="text-right font-mono text-navy-900 dark:text-navy-50 font-black bg-navy-50/20 w-[140px]" 
      />
    </CustomDataTable>
  );
};
