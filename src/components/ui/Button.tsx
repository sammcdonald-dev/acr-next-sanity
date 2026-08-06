import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,box-shadow,transform] hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-coral-dark',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border-2 border-navy bg-background text-navy shadow-xs hover:bg-navy hover:text-white',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-navy-dark',
        accent: 'bg-accent text-accent-foreground shadow-sm hover:bg-gold-dark',
        ghost:
          'rounded-lg hover:bg-accent hover:text-accent-foreground hover:scale-100',
        link: 'rounded-none text-coral underline-offset-4 hover:underline hover:scale-100',
        gradient:
          'bg-gradient-to-r from-coral to-gold text-navy font-bold shadow-sm hover:from-coral-dark hover:to-gold-dark',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-9 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 px-7 text-base has-[>svg]:px-5',
        xl: 'h-14 text-lg px-9 has-[>svg]:px-7',
        icon: 'size-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
