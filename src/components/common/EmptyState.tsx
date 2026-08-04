import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

/** État vide générique (aucune donnée) réutilisable dans les listes/tableaux. */
export function EmptyState({ icon = 'pi pi-inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className={`${icon} mb-2 text-3xl text-navy-300 dark:text-navy-600`} />
      <p className="text-sm font-semibold text-navy-600 dark:text-navy-200">{title}</p>
      {description && <p className="max-w-sm text-sm text-navy-400 dark:text-navy-400">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
