import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-navy-100 text-navy-700 dark:bg-navy-700 dark:text-navy-100',
        success: 'bg-sky-accent-50 text-sky-accent-600 dark:bg-sky-accent-500/15 dark:text-sky-accent-400',
        warning: 'bg-amber-accent-500/10 text-amber-accent-500',
        danger: 'bg-red-accent-500/10 text-red-accent-500',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
