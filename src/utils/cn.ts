import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne intelligemment des classes Tailwind (évite les conflits,
 * ex: "p-2 p-4" -> "p-4"). Convention standard shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
