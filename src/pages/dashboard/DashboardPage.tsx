import { useMemo } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentActivity = [
  { id: 1, icon: 'pi pi-shopping-cart', text: 'Nouvelle commande #CMD-2456 créée par Jean Havyarimana', time: 'Il y a 5 min' },
  { id: 2, icon: 'pi pi-user-plus', text: 'Nouveau client "SODECO Sarl" ajouté', time: 'Il y a 32 min' },
  { id: 3, icon: 'pi pi-box', text: 'Réception de stock : 120 unités "Câble HDMI 2m"', time: 'Il y a 1 h' },
  { id: 4, icon: 'pi pi-file-check', text: 'Facture #F-1032 marquée comme payée', time: 'Il y a 3 h' },
];

const shortcuts = [
  { label: 'Nouvelle commande', icon: 'pi pi-plus-circle', path: '/purchases/orders' },
  { label: 'Nouveau client', icon: 'pi pi-user-plus', path: '/clients/list' },
  { label: 'Nouvelle catégorie', icon: 'pi pi-tags', path: '/products/categories' },
  { label: 'Voir les factures', icon: 'pi pi-receipt', path: '/accounting/invoices' },
];

interface RecentItemRow {
  id: string;
  reference: string;
  client: string;
  montant: string;
  statut: 'Payée' | 'En attente' | 'En retard';
  date: string;
}

const recentItems: RecentItemRow[] = [
  { id: '1', reference: 'F-1032', client: 'SODECO Sarl', montant: '1 250 000 BIF', statut: 'Payée', date: '20/07/2026' },
  { id: '2', reference: 'F-1033', client: 'Kigobe Distribution', montant: '480 000 BIF', statut: 'En attente', date: '20/07/2026' },
  { id: '3', reference: 'F-1034', client: 'Bujumbura Trading', montant: '2 100 000 BIF', statut: 'En retard', date: '19/07/2026' },
  { id: '4', reference: 'F-1035', client: 'Gitega Market', montant: '675 000 BIF', statut: 'Payée', date: '18/07/2026' },
];

const statusVariant: Record<RecentItemRow['statut'], 'success' | 'warning' | 'danger'> = {
  Payée: 'success',
  'En attente': 'warning',
  'En retard': 'danger',
};

export function DashboardPage() {
  const chartData = useMemo(
    () => ({
      labels: ['Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil','Août','Sept','Oct','Nov','Déc'],
      datasets: [
        {
          label: 'Ventes (en millions BIF)',
          data: [12, 15, 11, 18, 22, 26,20,21,23,20,15,20],
          fill: true,
          backgroundColor: 'rgba(14, 165, 233, 0.15)',
          borderColor: '#0ea5e9',
          tension: 0.4,
        },
        {
          label: 'Achats (en millions BIF)',
          data: [8, 9, 10, 12, 13, 15,20,20,21,15,14,10],
          fill: false,
          borderColor: '#2c4a6e',
          borderDash: [4, 4],
          tension: 0.4,
        },
      ],
    }),
    [],
  );

  const chartOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' as const } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(148,163,184,0.15)' } },
      },
    }),
    [],
  );

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Aperçu de l'activité de l'entreprise" />

      {/* Cartes statistiques */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Chiffre d'affaires (mois)" value="26,4 M BIF" icon="pi pi-wallet" accent="sky" trend={{ value: '+18% vs mois dernier', positive: true }} />
        <StatCard label="Commandes en cours" value="47" icon="pi pi-shopping-cart" accent="navy" trend={{ value: '+6 aujourd\'hui', positive: true }} />
        <StatCard label="Clients actifs" value="312" icon="pi pi-users" accent="navy" />
        <StatCard label="Factures en retard" value="8" icon="pi pi-exclamation-triangle" accent="red" trend={{ value: '+2 cette semaine', positive: false }} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Graphique ventes/achats */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des ventes et achats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Chart type="line" data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-500/10 text-navy-600 dark:text-navy-300">
                    <i className={`${activity.icon} text-sm`} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-navy-700 dark:text-navy-200">{activity.text}</p>
                    <p className="text-xs text-navy-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Raccourcis */}
        <Card>
          <CardHeader>
            <CardTitle>Raccourcis</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                className="flex flex-col items-center gap-2 rounded-lg border border-navy-100 p-4 text-center text-xs font-medium text-navy-600 transition-colors hover:border-sky-accent-500 hover:text-sky-accent-500 dark:border-navy-700 dark:text-navy-200"
              >
                <i className={`${shortcut.icon} text-lg`} aria-hidden />
                {shortcut.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Tableau des derniers éléments (factures récentes) */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Dernières factures</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <DataTable value={recentItems} size="small" stripedRows showGridlines>
              <Column field="reference" header="Référence" />
              <Column field="client" header="Client" />
              <Column field="montant" 
                      header="Montant"  
                      bodyStyle={{ textAlign: 'right' }}/>
              <Column field="date" header="Date" />
              <Column
                field="statut"
                header="Statut"
                body={(row: RecentItemRow) => <Badge variant={statusVariant[row.statut]}>{row.statut}</Badge>}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
