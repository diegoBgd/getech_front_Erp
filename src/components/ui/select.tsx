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
        unstyled // Désactive les styles globaux Indigo pour appliquer 100% de votre thème
        className={cn(
          "w-full rounded-md border border-navy-200 bg-white text-sm transition-all duration-150 shadow-none text-navy-900 focus:outline-hidden",
          "focus:border-sky-accent-500 focus:ring-1 focus:ring-sky-accent-500",
          "dark:bg-navy-950 dark:border-navy-700 dark:text-navy-50",
          error && "border-red-accent-500 focus:border-red-accent-500 focus:ring-red-accent-500",
          className
        )}
        pt={{
          root: { className: "flex items-center min-h-[38px] relative cursor-pointer" },
          input: { className: "p-3 py-2 text-sm text-navy-900 dark:text-navy-50 placeholder:text-navy-300 pl-3 bg-transparent border-none outline-hidden w-full text-left" },
          trigger: { className: "text-navy-400 px-3 flex items-center justify-center bg-transparent border-none absolute right-0 top-0 bottom-0" },
          panel: { className: "bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 rounded-lg shadow-xl mt-1 overflow-hidden z-50" },
          list: { className: "p-1 flex flex-col gap-0.5 list-none m-0" },
          // Correction du typage : on utilise la propriété "context" du paramètre d'options
          item: (options: any) => {
            const isSelected = options?.context?.selected; // Accès correct en mode unstyled

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
