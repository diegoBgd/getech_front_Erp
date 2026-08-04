import { ProgressSpinner } from 'primereact/progressspinner';

interface LoaderProps {
  label?: string;
}

/** Indicateur de chargement réutilisable, basé sur PrimeReact ProgressSpinner. */
export function Loader({ label = 'Chargement...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-400">
      <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
