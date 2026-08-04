import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME, APP_VERSION, COMPANY_NAME } from '@/utils/constants';

const infoCards = [
  { icon: 'pi pi-building', title: 'Société', value: COMPANY_NAME, description: 'Éditeur de la plateforme' },
  { icon: 'pi pi-tag', title: 'Version installée', value: APP_VERSION, description: 'Dernière mise à jour : Juillet 2026' },
  { icon: 'pi pi-shield', title: 'Sécurité', value: 'Connexion sécurisée', description: 'Session chiffrée et surveillée' },
];

const quickLinks = [
  { label: 'Voir le Dashboard', icon: 'pi pi-chart-line', path: '/' },
  { label: 'Gérer les catégories', icon: 'pi pi-tags', path: '/products/categories' },
  { label: 'Consulter les clients', icon: 'pi pi-users', path: '/clients/list' },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title={`Bonjour, ${user.firstName} 👋`} subtitle={`Bienvenue sur ${APP_NAME}, votre plateforme de gestion d'entreprise`} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {infoCards.map((info) => (
          <Card key={info.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-accent-500/10 text-sky-accent-500">
                <i className={`${info.icon} text-lg`} aria-hidden />
              </span>
              <div>
                <p className="text-xs font-medium text-navy-400">{info.title}</p>
                <p className="text-base font-bold text-navy-800 dark:text-navy-100">{info.value}</p>
                <p className="text-xs text-navy-400">{info.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>À propos de Waangu ERP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-navy-600 dark:text-navy-300">
            <p>
              Waangu ERP centralise la gestion de vos produits, clients, achats, stocks et
              comptabilité au sein d'une interface unique, pensée pour les équipes opérationnelles
              et la direction.
            </p>
            <p>
              Utilisez le menu latéral pour naviguer entre les différents modules. Chaque module
              dispose de ses propres pages, tableaux et statistiques.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accès rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className="flex items-center gap-3 rounded-lg border border-navy-100 px-3 py-2.5 text-sm font-medium text-navy-600 transition-colors hover:border-sky-accent-500 hover:text-sky-accent-500 dark:border-navy-700 dark:text-navy-200"
              >
                <i className={`${link.icon} text-base`} aria-hidden />
                {link.label}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
