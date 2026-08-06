import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const inputVariants = cva(
  "flex w-full rounded-md border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-navy-300 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-sky-accent-500 focus-visible:border-sky-accent-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-700 dark:bg-navy-950 dark:text-navy-50 dark:placeholder:text-navy-500 dark:focus-visible:ring-sky-accent-400 dark:focus-visible:border-sky-accent-400",
  {
    variants: {
      error: {
        true: "border-red-accent-500 focus-visible:ring-red-accent-500 focus-visible:border-red-accent-500 dark:border-red-accent-500",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ error, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
