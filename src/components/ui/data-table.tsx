import * as React from "react";
import { DataTable, type DataTableProps } from "primereact/datatable";
import { cn } from "@/utils/cn";

export type CustomDataTableProps<T extends any[]> = DataTableProps<T> & {
  error?: boolean;
};

export function CustomDataTable<T extends any[]>({
  className,
  children,
  ...props
}: CustomDataTableProps<T>) {
  return (
    <DataTable
      unstyled
      paginator
      rows={10}
      responsiveLayout="scroll"
      className={cn("w-full text-left border-collapse text-xs", className)}
      pt={{
        root: { className: "w-full overflow-x-auto" },
        wrapper: { className: "overflow-x-auto" },
        // Bordure extérieure complète autour du tableau
        table: { className: "w-full border-collapse border border-navy-100 dark:border-navy-800" }, 
        
        // En-tête : h-11 pour la hauteur, px-4 pour l'espace à gauche, bordure complète
        thead: { className: "[&_th]:py-3.5 [&_th]:px-4 [&_th]:border [&_th]:border-navy-100 dark:[&_th]:border-navy-800" },
        
        // Corps : px-4 sur chaque cellule (td) pour créer l'espace de respiration à gauche et à droite, bordure complète
        tbody: { className: "[&_td]:p-1.5 [&_td]:px-1.5 [&_td]:border [&_td]:border-navy-100 dark:[&_td]:border-navy-800/60" },
        
        paginator: {
          root: { className: "flex items-center justify-end p-4 border-t border-navy-100 dark:border-navy-800 bg-white dark:bg-navy-950 gap-1 text-[11px]" },
          prevPageButton: { className: "cursor-pointer select-none" },
          nextPageButton: { className: "cursor-pointer select-none" },
          firstPageButton: { className: "cursor-pointer select-none" },
          lastPageButton: { className: "cursor-pointer select-none" },
          pages: { className: "flex items-center gap-1" }
        }
      }}
      {...props}
    >
      {children}
    </DataTable>
  );
}
