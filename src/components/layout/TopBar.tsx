import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import { getPageTitle } from '@/routes/routesConfig';
import { UserMenu } from '@/components/layout/UserMenu';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';
import { Select } from '../ui/select'; // 💡 Votre composant UI original

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

  const { exerciceId, setExerciceId, exercicesOptions } = useExerciceGlobal();

  const handleHamburgerClick = () => {
    if (window.innerWidth >= 1024) {
      toggleCollapsed();
    } else {
      toggleMobile();
    }
  };

  return (
    <header className="sticky top-0 z-20 grid h-16 grid-cols-[5%_30%_65%] items-center border-b border-navy-100 bg-white/80 px-4 backdrop-blur-sm dark:border-navy-800 dark:bg-navy-900/80 lg:px-6">
       
      {/* 🚪 COLONNE 1 (GAUCHE) : Bouton Hamburger */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={handleHamburgerClick}
          aria-label={collapsed ? 'Développer le menu' : 'Réduire le menu'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800"
        >
          <i className="pi pi-bars text-lg" aria-hidden />
        </button>
      </div>

      {/* 🏛️ COLONNE 2 (CENTRE) : Titre de la page */}
      <div className="flex justify-center text-center">
        <h1 className="hidden text-base font-semibold text-navy-800 dark:text-navy-100 md:block truncate max-w-full">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* 🛠️ COLONNE 3 (DROITE) : Bloc Exercice Global + Outils Système */}
      <div className="flex items-center justify-end gap-1.5">
        
        {/* Zone Période isolée et raccordée proprement à votre Select UI */}
        <div className="w-[140px] sm:w-[220px] flex items-center gap-2 relative animate-fade-in shrink-0">
          <i className="pi pi-calendar-clock text-base text-navy-400 dark:text-navy-500" aria-hidden />
          
          <div className="w-full">
            {/* 💡 CORRECTION DU SELECT : On utilise l'API standard de votre composant UI */}
            <Select 
              value={exerciceId} 
              options={exercicesOptions} 
              onChange={(e: any) => setExerciceId(e.value ? Number(e.value) : null)}
              placeholder={exercicesOptions.length === 0 ? "Chargement..." : "Exercice..."}
              className="w-full text-xs font-bold shadow-3xs h-[32px]"
            />
          </div>
        </div>

        {/* Ligne de séparation verticale réglementaire */}
        <div className="h-6 w-px bg-navy-100 dark:bg-navy-700 mx-1.5 shrink-0" aria-hidden />

        {/* 🔔 CLOCHE DE NOTIFICATION */}
        <button
          type="button"
          onClick={(event) => notifRef.current?.toggle(event)}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800 shrink-0"
        >
          <i className="pi pi-bell text-lg" aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-accent-500" aria-hidden />
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

        {/* ✉️ MESSAGES COMPAGNONS */}
        <button
          type="button"
          aria-label="Messages"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800 sm:flex shrink-0"
        >
          <i className="pi pi-envelope text-lg" aria-hidden />
        </button>

        {/* 🌗 ALTERNANCE DE THÈMES */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Changer le thème"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800 shrink-0"
        >
          <i className={theme === 'dark' ? 'pi pi-sun text-lg' : 'pi pi-moon text-lg'} aria-hidden />
        </button>

        <div className="mx-0.5 h-6 w-px bg-navy-100 dark:bg-navy-700 shrink-0" aria-hidden />

        {/* MENU PROFIL UTILISATEUR */}
        <UserMenu />
      </div>
    </header>
  );
}
