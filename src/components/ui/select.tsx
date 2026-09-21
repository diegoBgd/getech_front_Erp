import * as React from "react";
import { Dropdown, type DropdownProps } from "primereact/dropdown";
import { cn } from "@/utils/cn";

export interface SelectProps extends DropdownProps {
  error?: boolean;
}

const Select = React.forwardRef<Dropdown, SelectProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <Dropdown
        ref={ref}
        unstyled
        filter={props.filter ?? true} // Active la recherche instantanée (Shadcn/ui style)
        scrollHeight={props.scrollHeight ?? "250px"} // 💡 CORRECTIF MAÎTRE : Force le moteur PrimeReact à gérer la hauteur et le défilement
        className={cn(
          "w-full h-[30px] rounded-md border border-navy-200 bg-white text-sm transition-all duration-150 shadow-none text-navy-900 focus:outline-hidden flex items-center",
          "focus:border-sky-accent-500 focus:ring-1 focus:ring-sky-accent-500",
          "dark:bg-navy-950 dark:border-navy-700 dark:text-navy-50",
          error && "border-red-accent-500 focus:border-red-accent-500 focus:ring-red-accent-500",
          className
        )}
        // 💡 MODIFICATION COMPATIBLE UNSTYLED DANS VOTRE SELECT.TSX
        pt={{
          root: { className: "flex items-center min-h-[30px] relative cursor-pointer" },
          input: { className: "px-3 py-2 text-xs font-bold text-navy-900 dark:text-navy-50 placeholder:text-navy-300 pl-3 bg-transparent border-none outline-hidden w-full text-left" },
          trigger: { className: "text-navy-400 px-3 flex items-center justify-center bg-transparent border-none absolute right-0 top-0 bottom-0" },
          panel: { className: "bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 rounded-lg shadow-xl mt-1 z-50 min-w-[220px]" },

          // ❌ ANCIENNE LIGNE : list: { className: "p-1 flex flex-col gap-0.5 list-none m-0" },
          // 💡 NOUVELLE LIGNE CORRIGÉE : On force la hauteur max et l'ascenseur directement sur le composant liste de PrimeReact
          list: { className: "p-1 flex flex-col gap-0.5 list-none m-0 overflow-y-auto max-h-[220px] thin-scrollbar" },

          filterContainer: { className: "relative p-2 bg-navy-50/50 dark:bg-navy-950/40 border-b border-navy-100 dark:border-navy-800 flex items-center w-full" },
          filterInput: { className: "w-full rounded-md border border-navy-200 bg-white pl-8 pr-3 py-1.5 text-xs text-navy-900 placeholder:text-navy-300 transition-colors focus:border-sky-accent-500 focus:outline-hidden dark:bg-navy-900 dark:border-navy-700 dark:text-navy-100" },
          filterIcon: { className: "absolute left-4 text-navy-400 text-[10px] pointer-events-none" },
          item: (options: any) => {
            const isSelected = options?.context?.selected;
            return {
              className: cn(
                "px-3 py-2 text-sm rounded-md transition-colors cursor-pointer text-navy-800 dark:text-navy-200 list-none",
                "hover:bg-navy-50 hover:text-navy-900 dark:hover:bg-navy-800 dark:hover:text-navy-50",
                isSelected && "bg-navy-700 text-white font-semibold dark:bg-sky-accent-500 hover:bg-navy-700 dark:hover:bg-sky-accent-500"
              )
            };
          }
        }}

        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export { Select };
