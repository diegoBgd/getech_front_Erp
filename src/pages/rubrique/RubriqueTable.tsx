import { Button } from '@/components/ui/button';
import type { RubriqueFinanciere } from '@/services/rubrique.service';
import React from 'react';

interface TableProps {
  rubriques: RubriqueFinanciere[];
  onDelete: (id: number) => void;
}

export const RubriqueTable: React.FC<TableProps> = ({ rubriques, onDelete }) => {
  return (
    <div className="w-full overflow-hidden border border-navy-200 bg-white shadow-xs rounded-xl">
      <table className="w-full text-left border-collapse text-xs text-navy-900">
        <thead>
          <tr className="bg-navy-50 font-bold border-b border-navy-200 [&_th]:p-3">
            <th>Ordre</th>
            <th>Code Technique</th>
            <th>Intitulé Ligne</th>
            <th>Nature</th>
            <th>Mode</th>
            <th>Plage Brut</th>
            <th>Plage Amort.</th>
            <th>Solde Admis</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100 font-medium">
          {rubriques.map((rub) => (
            <tr key={rub.id} className="hover:bg-navy-50/40 transition-colors [&_td]:p-3">
              <td className="font-bold text-navy-400">{rub.ordre}</td>
              <td className="font-mono font-bold text-navy-600">{rub.code}</td>
              <td className="uppercase font-bold text-navy-900">{rub.intitule}</td>
              <td>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  rub.nature === 'ACTIF' ? 'bg-emerald-50 text-emerald-700' :
                  rub.nature === 'PASSIF' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {rub.nature}
                </span>
              </td>
              <td className="font-bold text-navy-500">{rub.modeCalcul}</td>
              <td className="font-mono text-emerald-700 font-black">{rub.plageComptesPrincipal || '-'}</td>
              <td className="font-mono text-rose-700 font-black">{rub.plageComptesCorrectif || '-'}</td>
              <td className="text-[10px] text-navy-400 uppercase font-bold">{rub.sensSoldeAdmis}</td>
              <td className="text-center">
                {rub.id && (
                  <Button type="button" variant="outline" size="sm" className="h-6 px-2 text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => onDelete(rub.id!)}>
                    <i className="pi pi-trash text-[10px]"></i>
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
