import { useClock } from '@/hooks/useClock';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { formatClock } from '@/utils/formatDate';
import { APP_NAME, APP_VERSION, APP_YEAR, COMPANY_NAME, APP_ENVIRONMENT } from '@/utils/constants';

/** Pied de page fixe affichant les informations système et l'état de connexion. */
export function BottomBar() {
  const now = useClock();
  const isOnline = useOnlineStatus();

  return (
    <footer className="flex h-11 shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-navy-100 bg-white px-4 text-xs text-navy-400 dark:border-navy-800 dark:bg-navy-900 lg:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-semibold text-navy-600 dark:text-navy-200">{APP_NAME}</span>
        <span>Version {APP_VERSION}</span>
        <span className="hidden sm:inline">
          © {APP_YEAR} {COMPANY_NAME}
        </span>
        <span className="hidden items-center gap-1 md:inline-flex">
          <i className="pi pi-cog text-[10px]" aria-hidden />
          Environnement : {APP_ENVIRONMENT}
        </span>
      </div>

      <div className="flex items-center gap-x-4">
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-sky-accent-500' : 'bg-red-accent-500'}`}
            aria-hidden
          />
          Serveur : {isOnline ? 'Connecté' : 'Hors ligne'}
        </span>
        <span className="font-tabular">{formatClock(now)}</span>
      </div>
    </footer>
  );
}
