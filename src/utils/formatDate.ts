/**
 * Formate une heure au format HH:MM:SS (utilisé par la BottomBar, mis à jour chaque seconde).
 */
export function formatClock(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Formate une date au format lisible français (ex: "22 juillet 2026").
 */
export function formatDateFr(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
