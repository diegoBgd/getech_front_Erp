import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import { getPageTitle } from '@/routes/routesConfig';
import { UserMenu } from '@/components/layout/UserMenu';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';
import { Select } from '../ui/select';

const mockNotifications = [
  { id: 1, text: 'Nouvelle commande #CMD-2456 reçue', time: 'Il y a 5 min' },
  { id: 2, text: 'Stock faible : Catégorie Mobilier', time: 'Il y a 1 h' },
  { id: 3, text: 'Facture #F-1032 en retard de paiement', time: 'Hier' },
];

export function TopBar() {
  const { collapsed, toggleCollapsed, toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const notifRef = useRef<OverlayPanel>(null);

  // Récupération des éléments du contexte global de gestion des exercices
  const { exerciceId, setExerciceId, exercicesOptions } = useExerciceGlobal();
  const [estEnCoursDeChargement, setEstEnCoursDeChargement] = useState<boolean>(true);

  // 💡 ANALYSE DE LA DISPONIBILITÉ DES DONNÉES
  useEffect(() => {
    // Si l'application a fini d'interroger le service, on coupe l'état de chargement
    if (exercicesOptions && exercicesOptions.length >= 0) {
      setEstEnCoursDeChargement(false);
    }
  }, [exercicesOptions]);

  const handleHamburgerClick = () => {
    if (window.innerWidth >= 1024) toggleCollapsed();
    else toggleMobile();
  };

  // Détermination dynamique du libellé d'attente ou d'erreur
  const getPlaceholderSelect = () => {
    if (estEnCoursDeChargement) return "Chargement...";
    if (!exercicesOptions || exercicesOptions.length === 0) return "Aucun exercice trouvé";
    return "Choisir un exercice...";
  };

  return (
    <header className="sticky top-0 z-20 grid h-16 grid-cols-[5%_30%_65%] items-center border-b border-navy-100 bg-white/80 px-4 backdrop-blur-sm dark:border-navy-800 dark:bg-navy-900/80 lg:px-6">
      <div className="flex items-center justify-start">
        <button type="button" onClick={handleHamburgerClick} className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800">
          <i className="pi pi-bars text-lg" />
        </button>
      </div>

      <div className="flex justify-center text-center">
        <h1 className="hidden text-base font-semibold text-navy-800 dark:text-navy-100 md:block truncate max-w-full">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center justify-end gap-1.5">
        {/* BLOC EXERCICE GLOBAL ADAPTATIF */}
        <div className="w-[140px] sm:w-[220px] flex items-center gap-2 relative animate-fade-in shrink-0">
          <i className="pi pi-calendar-clock text-base text-navy-400 dark:text-navy-500" />
          <div className="w-full">
            <Select 
              value={exerciceId} 
              options={exercicesOptions || []} 
              onChange={(e: any) => setExerciceId(e.value ? Number(e.value) : null)}
              placeholder={getPlaceholderSelect()}
              disabled={!exercicesOptions || exercicesOptions.length === 0} // Désactive le champ s'il n'y a pas d'exercice
              className={`w-full text-xs font-bold shadow-3xs h-[32px] ${
                (!exercicesOptions || exercicesOptions.length === 0) && !estEnCoursDeChargement ? 'border-red-accent-500 text-red-500 bg-red-50/10' : ''
              }`} 
            />
          </div>
        </div>

        <div className="h-6 w-px bg-navy-100 dark:bg-navy-700 mx-1.5 shrink-0" />

        <button type="button" onClick={(event) => notifRef.current?.toggle(event)} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800 shrink-0">
          <i className="pi pi-bell text-lg" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-accent-500" />
        </button>
        
        <OverlayPanel ref={notifRef} className="!w-80">
          <p className="mb-2 px-1 text-sm font-semibold text-navy-800 dark:text-navy-100">Notifications</p>
          <ul className="flex flex-col divide-y divide-navy-100 dark:divide-navy-700">
            {mockNotifications.map((notif) => (
              <li key={notif.id} className="flex flex-col gap-0.5 px-1 py-2">
                <span className="text-sm text-navy-700 dark:text-navy-200">{notif.text}</span>
                <span className="text-xs text-navy-400">{notif.time}</span>
              </li>
            ))}
          </ul>
        </OverlayPanel>

        <button type="button" className="hidden h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800 sm:flex shrink-0">
          <i className="pi pi-envelope text-lg" />
        </button>

        <button type="button" onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800 shrink-0">
          <i className={theme === 'dark' ? 'pi pi-sun text-lg' : 'pi pi-moon text-lg'} />
        </button>

        <div className="mx-0.5 h-6 w-px bg-navy-100 dark:bg-navy-700 shrink-0" />
        <UserMenu />
      </div>
    </header>
  );
}
