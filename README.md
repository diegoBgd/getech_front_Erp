# Waangu ERP — Frontend

Application frontend professionnelle de type ERP, construite avec **React 19**, **Vite**, **TypeScript**, **PrimeReact**, **Tailwind CSS v4** et **shadcn/ui**.

## Démarrage rapide

```bash
npm install
npm run dev      # démarre le serveur de développement (http://localhost:5173)
npm run build    # build de production (vérifie aussi les types avec tsc)
npm run preview  # sert le build de production localement
```

## Stack technique

| Domaine              | Choix                                  |
|-----------------------|-----------------------------------------|
| Framework             | React 19 + Vite                        |
| Langage               | TypeScript (strict)                    |
| Composants riches     | PrimeReact 10 + PrimeIcons              |
| Style utilitaire      | Tailwind CSS v4 (thème custom "Waangu")|
| Primitives UI         | shadcn/ui (Button, Card, Badge)        |
| Routing               | React Router DOM v7                    |
| Formulaires           | React Hook Form                        |
| HTTP                  | Axios                                  |
| Icônes                | Lucide React + PrimeIcons              |
| Graphiques            | Chart.js (via `primereact/chart`)      |

> **Note sur le thème PrimeReact** : les composants PrimeReact (DataTable, Dialog, Toast, Chart, OverlayPanel...) utilisent le thème `lara-light-indigo` et restent en apparence claire même quand l'application bascule en mode sombre. Le reste de l'interface (Sidebar, TopBar, BottomBar, cartes, pages) est entièrement piloté par Tailwind et supporte le mode sombre. Pour une parité complète, l'étape suivante serait de passer PrimeReact en mode `unstyled` avec des *passthrough* Tailwind — non fait ici pour rester dans le périmètre du brief.

## Architecture des dossiers

```
src/
├── assets/        # Images, SVG, polices locales, etc.
├── components/
│   ├── layout/    # Composants de mise en page globale : Sidebar, TopBar, BottomBar, UserMenu
│   ├── ui/        # Primitives shadcn/ui réutilisables partout (Button, Card, Badge...)
│   ├── forms/     # Composants de formulaire réutilisables (ex: CategoryForm)
│   ├── navigation/# Configuration et rendu du menu (menuConfig.ts, SidebarMenuItem.tsx)
│   └── common/    # Composants transverses (PageHeader, StatCard, Loader, EmptyState)
│
├── pages/         # Une page = un dossier. Contient uniquement la logique propre à la page.
│   ├── dashboard/
│   ├── home/
│   └── products/
│       └── categories/
│
├── services/      # Couche d'accès aux données : api.ts (axios) + services métier (categoryService.ts)
├── hooks/         # Hooks personnalisés (useSidebar, useTheme, useAuth, useClock, useOnlineStatus)
├── contexts/       # Contexts React (SidebarContext, ThemeContext, AuthContext)
├── layouts/       # Layouts englobant plusieurs pages (MainLayout = Sidebar + TopBar + BottomBar)
├── routes/        # Déclaration des routes (AppRouter.tsx) + table titres de page (routesConfig.ts)
├── utils/         # Fonctions utilitaires pures (cn.ts, formatDate.ts, constants.ts)
├── types/         # Types TypeScript partagés (menu, user, category)
├── styles/        # Réservé aux styles additionnels (actuellement, tout est dans index.css)
└── App.tsx        # Point d'assemblage des Providers + RouterProvider
```

### Pourquoi cette organisation ?

- **`components/` vs `pages/`** : `components/` contient tout ce qui est réutilisable sur plusieurs pages (layout, primitives UI, formulaires génériques). `pages/` contient la composition spécifique à une route — une page importe des composants, elle n'en définit pas de nouveaux qui seraient réutilisés ailleurs.
- **`services/`** isole tous les appels réseau/données. Les composants ne connaissent jamais `axios` directement : ils appellent `categoryService.getAll()`, ce qui permet de remplacer la simulation en mémoire par un vrai backend sans toucher à l'UI.
- **`contexts/` + `hooks/`** vont toujours par paire : un context expose un state global (Sidebar, Thème, Auth), un hook (`useSidebar`, `useTheme`, `useAuth`) l'expose de façon typée et sûre (erreur explicite si utilisé hors Provider).
- **`routes/`** centralise la déclaration des routes (`AppRouter.tsx`) et la correspondance route → titre affiché dans la TopBar (`routesConfig.ts`), pour ne jamais dupliquer cette information dans chaque page.
- **`types/`** regroupe les interfaces partagées entre plusieurs couches (ex: `ProductCategory` est utilisé par le service, le formulaire et la page).

## Layout principal

- **Sidebar** (`components/layout/Sidebar.tsx`) : logo + nom d'application, menu principal avec sous-menus en accordéon (`components/navigation/SidebarMenuItem.tsx`, récursif), item actif mis en évidence via `NavLink`, scroll interne si le menu est long, réductible (icônes + tooltip PrimeReact + flyout au survol pour les sous-menus), responsive (overlay sur mobile piloté par `SidebarContext`).
- **TopBar** (`components/layout/TopBar.tsx`) : bouton hamburger (réduit le Sidebar en desktop, l'ouvre en overlay sur mobile), titre de la page courante (centré, dérivé de `routesConfig.ts`), notifications, messages, bascule thème clair/sombre, composant utilisateur (`UserMenu.tsx`).
- **UserMenu** (`components/layout/UserMenu.tsx`) : photo/initiales, nom complet, fonction. Au clic : panel avec Mon profil / Paramètres / Changer le mot de passe / Préférences / Déconnexion. Si l'utilisateur a le rôle `admin` (voir `AuthContext.tsx`), une section additionnelle apparaît : utilisateurs connectés + accès Administration système (Journaux, Sessions actives, Configuration, Gestion des rôles). Cette section est un simple bloc conditionnel dans le JSX : ajouter une nouvelle fonctionnalité admin ne demande qu'une entrée supplémentaire dans les tableaux `adminSystemMenuItems`/`profileMenuItems`.
- **BottomBar** (`components/layout/BottomBar.tsx`) : nom de la société éditrice, version, année, copyright, nom du produit, environnement, heure en temps réel (`useClock`), état de connexion serveur (`useOnlineStatus`, basé sur les évènements `online`/`offline` du navigateur — à remplacer par un ping API réel en production).

## Pages livrées

1. **Dashboard** (`/`) — cartes statistiques (KPI), graphique ventes/achats (PrimeReact Chart + Chart.js), activités récentes, raccourcis, tableau des dernières factures.
2. **Accueil** (`/home`) — message de bienvenue personnalisé, cartes d'information générale, accès rapides.
3. **Catégories Produit** (`/products/categories`) — exemple CRUD complet : DataTable avec recherche (filtre global côté client), pagination, tri, ajout/modification via Dialog + React Hook Form, suppression avec `ConfirmDialog`, notifications `Toast`. Les données sont simulées en mémoire dans `services/categoryService.ts` (signatures asynchrones identiques à un vrai appel API, pour faciliter le branchement futur).

## Ajouter une nouvelle page/menu

1. Créer le composant de page dans `pages/<module>/<Nom>Page.tsx`.
2. Ajouter la route dans `routes/AppRouter.tsx`.
3. Ajouter le titre dans `routes/routesConfig.ts`.
4. Ajouter l'entrée (et éventuellement les sous-menus) dans `components/navigation/menuConfig.ts`.

## Responsive

- **Desktop** : Sidebar fixe, réductible en mode icônes.
- **Tablette/Mobile** : Sidebar masqué par défaut, ouvert en overlay via le bouton hamburger (`SidebarContext.mobileOpen`).
- Toutes les grilles de cartes (Dashboard, Accueil) et le DataTable s'adaptent en colonnes réduites sur petits écrans.
