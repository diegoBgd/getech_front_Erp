import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** En-tête de page réutilisable : titre, sous-titre et emplacement pour les actions (boutons). */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 pb-4 dark:border-navy-800">
      <div>
        <h2 className="text-xl font-bold text-navy-800 dark:text-navy-100">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-navy-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
