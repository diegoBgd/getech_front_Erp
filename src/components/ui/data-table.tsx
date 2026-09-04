import * as React from "react";
import { DataTable, type DataTableProps } from "primereact/datatable";
import { Select } from "../ui/select"; 
import { cn } from "@/utils/cn";

export type CustomDataTableProps<T extends any[]> = DataTableProps<T> & {
  error?: boolean;
};

export function CustomDataTable<T extends any[]>({
  className,
  children,
  rows = 5, 
  ...props
}: CustomDataTableProps<T>) {
  const [nombreLignes, setNombreLignes] = React.useState<number>(rows);

  const optionsEchelle = [
    { label: "Afficher 5 lignes", value: 5 },
    { label: "Afficher 10 lignes", value: 10 },
    { label: "Afficher 20 lignes", value: 20 },
    { label: "Afficher 50 lignes", value: 50 }
  ];

  return (
    <div className="w-full overflow-hidden border border-navy-200 bg-white dark:bg-navy-950 rounded-xl shadow-xs animate-fade-in">
      <DataTable
        unstyled
        paginator
        rows={nombreLignes} 
        /* 💡 AJOUT DES LIENS FIRST ET LAST DANS LE TEMPLATE DE NAVIGATION */
        paginatorTemplate="FirstPageLink PrevPageButton PageLinks NextPageButton LastPageLink"
        responsiveLayout="scroll"
        className={cn("w-full text-left border-collapse text-xs text-navy-900 dark:text-navy-100", className)}
        pt={{
          root: { className: "w-full" },
          wrapper: { className: "overflow-x-auto" },
          table: { className: "w-full border-collapse border border-navy-200 dark:border-navy-800" }, 
          thead: { 
            className: "[&_th]:py-2 [&_th]:px-3 [&_th]:bg-navy-50 dark:[&_th]:bg-navy-900/60 [&_th]:font-bold [&_th]:text-navy-800 dark:[&_th]:text-navy-200 [&_th]:border [&_th]:border-navy-200 dark:[&_th]:border-navy-800 text-[11px] uppercase tracking-wider" 
          },
          tbody: { 
            className: "[&_tr]:transition-colors [&_tr]:hover:bg-navy-50/40 dark:[&_tr]:hover:bg-navy-800/20 [&_td]:py-1.5 [&_td]:px-3 [&_td]:border [&_td]:border-navy-200 dark:[&_td]:border-navy-800/50 text-navy-700 dark:text-navy-300 font-medium" 
          },
          paginator: {
            root: { className: "flex items-center justify-between p-2 px-4 border-t border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-[11px] font-bold text-navy-500" },
            prevPageButton: { className: "cursor-pointer select-none p-1.5 hover:bg-navy-50 dark:hover:bg-navy-800 rounded-md transition-colors text-navy-600 dark:text-navy-400" },
            nextPageButton: { className: "cursor-pointer select-none p-1.5 hover:bg-navy-50 dark:hover:bg-navy-800 rounded-md transition-colors text-navy-600 dark:text-navy-400" },
            /* 💡 APPLICATION DIRECTE DU DESIGN SUR LES BOUTONS EXTRÊMES */
            firstPageButton: { className: "cursor-pointer select-none p-1.5 hover:bg-navy-50 dark:hover:bg-navy-800 rounded-md transition-colors text-navy-600 dark:text-navy-400" },
            lastPageButton: { className: "cursor-pointer select-none p-1.5 hover:bg-navy-50 dark:hover:bg-navy-800 rounded-md transition-colors text-navy-600 dark:text-navy-400" },
            
            pages: { className: "flex items-center gap-1" },

            pageButton: ({ context }: any) => ({
              className: cn(
                "px-2.5 py-0.5 rounded-md text-navy-700 dark:text-navy-300 font-bold transition-all cursor-pointer hover:bg-navy-50 dark:hover:bg-navy-800",
                context.active && "!bg-navy-800 !text-white !font-black shadow-xs dark:!bg-navy-700"
              )
            })
          }
        }}
        {...props}
      >
        {children}
      </DataTable>

      <div className="flex items-center justify-between px-4 pb-3 pt-1 bg-white dark:bg-navy-950 border-t border-dashed border-navy-100 dark:border-navy-800">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-navy-400 tracking-wider">
            Densité d'affichage :
          </span>
          <div className="w-[150px]">
            <Select
              value={nombreLignes}
              options={optionsEchelle}
              onChange={(e: any) => setNombreLignes(Number(e.value))}
              className="text-xs shadow-2xs h-[20px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
