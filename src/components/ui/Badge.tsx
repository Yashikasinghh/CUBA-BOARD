import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'violet' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-electric/15 text-electric-light border-electric/25',
  success: 'bg-neon/15 text-neon-light border-neon/25',
  warning: 'bg-gold/15 text-gold-light border-gold/25',
  danger: 'bg-rose/15 text-rose border-rose/25',
  violet: 'bg-violet/15 text-violet-light border-violet/25',
  outline: 'bg-transparent text-text-secondary border-border',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

const iconSizes: Record<BadgeSize, number> = {
  sm: 10,
  md: 12,
};

function Badge({
  variant = 'default',
  size = 'md',
  children,
  icon: Icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        'whitespace-nowrap select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {Icon && <Icon size={iconSizes[size]} className="shrink-0" />}
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };
