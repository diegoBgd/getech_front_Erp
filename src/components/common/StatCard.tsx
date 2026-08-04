import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: { value: string; positive: boolean };
  accent?: 'navy' | 'sky' | 'amber' | 'red';
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  navy: 'bg-navy-500/10 text-navy-600 dark:text-navy-300',
  sky: 'bg-sky-accent-500/10 text-sky-accent-500',
  amber: 'bg-amber-accent-500/10 text-amber-accent-500',
  red: 'bg-red-accent-500/10 text-red-accent-500',
};

/** Carte de statistique (KPI) utilisée sur le Dashboard. */
export function StatCard({ label, value, icon, trend, accent = 'navy' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', accentStyles[accent])}>
          <i className={`${icon} text-lg`} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-navy-400">{label}</p>
          <p className="font-tabular text-xl font-bold text-navy-800 dark:text-navy-100">{value}</p>
          {trend && (
            <p className={cn('mt-0.5 text-xs font-medium', trend.positive ? 'text-sky-accent-500' : 'text-red-accent-500')}>
              <i className={trend.positive ? 'pi pi-arrow-up' : 'pi pi-arrow-down'} aria-hidden /> {trend.value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
