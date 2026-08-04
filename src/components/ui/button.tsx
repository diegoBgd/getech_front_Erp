import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/**
 * Bouton shadcn/ui adapté au thème "Waangu" (navy / émeraude).
 * Utilisé pour les actions génériques de l'UI (hors DataTable PrimeReact,
 * qui garde ses propres boutons pour rester cohérente avec PrimeReact).
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-navy-600 text-white hover:bg-navy-700 dark:bg-sky-accent-500 dark:hover:bg-sky-accent-600',
        secondary: 'bg-navy-50 text-navy-700 hover:bg-navy-100 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700',
        outline: 'border border-navy-200 bg-transparent text-navy-700 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-100 dark:hover:bg-navy-800',
        ghost: 'bg-transparent text-navy-600 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800',
        destructive: 'bg-red-accent-500 text-white hover:bg-red-600',
        sky: 'bg-sky-accent-500 text-white hover:bg-sky-accent-600',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
