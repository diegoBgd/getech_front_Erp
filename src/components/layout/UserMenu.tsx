import { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/** Génère les initiales d'un utilisateur pour l'avatar de secours (pas de photo). */
function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const profileMenuItems = [
  { label: 'Mon profil', icon: 'pi pi-user' },
  { label: 'Paramètres', icon: 'pi pi-cog' },
  { label: 'Changer le mot de passe', icon: 'pi pi-key' },
  { label: 'Préférences', icon: 'pi pi-sliders-h' },
];

const adminSystemMenuItems = [
  { label: "Journaux d'activité", icon: 'pi pi-history', path: '/administration/logs' },
  { label: 'Sessions actives', icon: 'pi pi-desktop', path: '/administration/sessions' },
  { label: 'Configuration', icon: 'pi pi-sliders-v', path: '/administration/configuration' },
  { label: 'Gestion des rôles', icon: 'pi pi-shield', path: '/administration/roles' },
];

export function UserMenu() {
  const { user, connectedUsers, logout } = useAuth();
  const panelRef = useRef<OverlayPanel>(null);
  const navigate = useNavigate();
  const isAdmin = user.role === 'admin';

  const handleNavigate = (path?: string) => {
    panelRef.current?.hide();
    if (path) navigate(path);
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => panelRef.current?.toggle(event)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-navy-50 dark:hover:bg-navy-800"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-600 text-sm font-semibold text-white dark:bg-sky-accent-500">
          {getInitials(user.fullName)}
        </div>
        <div className="hidden text-sm leading-tight sm:block">
          <p className="font-semibold text-navy-800 dark:text-navy-100">{user.fullName}</p>
          <p className="text-xs text-navy-400 dark:text-navy-400">{user.jobTitle}</p>
        </div>
        <i className="pi pi-chevron-down hidden text-xs text-navy-400 sm:block" aria-hidden />
      </button>

      <OverlayPanel ref={panelRef} className="!w-72 !border-navy-100 !p-0 dark:!border-navy-700 dark:!bg-navy-800">
        <div className="border-b border-navy-100 px-4 py-3 dark:border-navy-700">
          <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">{user.fullName}</p>
          <p className="text-xs text-navy-400">{user.email}</p>
        </div>

        <div className="flex flex-col gap-0.5 p-2">
          {profileMenuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavigate()}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-700"
            >
              <i className={`${item.icon} text-sm text-navy-400`} aria-hidden />
              {item.label}
            </button>
          ))}
        </div>

        {/* Section réservée aux administrateurs : extensible facilement en ajoutant des entrées ci-dessus/ci-dessous */}
        {isAdmin && (
          <div className="border-t border-navy-100 p-2 dark:border-navy-700">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
              Utilisateurs actuellement connectés
            </p>
            <ul className="flex flex-col gap-1 px-1">
              {connectedUsers.map((connected) => (
                <li key={connected.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-navy-600 dark:text-navy-200">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-sky-accent-500" aria-hidden />
                  {connected.fullName}
                  <span className="ml-auto text-xs text-navy-400">{connected.connectedSince}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleNavigate('/administration/sessions')}
              className="mt-1 px-3 py-1.5 text-xs font-semibold text-sky-accent-500 hover:underline"
            >
              Voir tous
            </button>

            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
              Administration système
            </p>
            <div className="flex flex-col gap-0.5">
              {adminSystemMenuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-700"
                >
                  <i className={`${item.icon} text-sm text-navy-400`} aria-hidden />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-navy-100 p-2 dark:border-navy-700">
          <button
            type="button"
            onClick={() => {
              panelRef.current?.hide();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-accent-500 hover:bg-red-accent-500/10"
          >
            <i className="pi pi-sign-out text-sm" aria-hidden />
            Déconnexion
          </button>
        </div>
      </OverlayPanel>
    </>
  );
}
