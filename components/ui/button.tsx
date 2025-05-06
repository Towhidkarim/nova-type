import { cn } from '@/lib/utils';
import React from 'react';

type TButtonProps = React.ComponentProps<'button'> & {
  className?: string;
  children: React.ReactNode;
};
export default function Button({ className, children, ...rest }: TButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        ' hover:bg-foreground/10 mx-auto  px-3 py-2 border border-foreground/20 rounded-lg active:scale-95 transition-all cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  );
}
