import { type ReactNode, type HTMLAttributes, forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const baseStyles =
  'bg-bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6';

const variantStyles: Record<CardVariant, string> = {
  default: '',
  elevated:
    'hover:shadow-lg hover:shadow-electric/5 hover:-translate-y-0.5 transition-all duration-200',
  interactive:
    'cursor-pointer hover:shadow-lg hover:shadow-electric/5 hover:-translate-y-0.5 hover:border-electric/30 transition-all duration-200 active:scale-[0.99]',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, onClick, ...props }, ref) => {
    const Comp = variant === 'default' ? 'div' : motion.div;
    const motionProps =
      variant !== 'default'
        ? ({
            whileHover: { y: -2 },
            transition: { type: 'spring', stiffness: 300, damping: 30 },
          } as HTMLMotionProps<'div'>)
        : {};

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        onClick={onClick}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Comp>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for structured cards
function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-text-secondary mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between mt-4 pt-4 border-t border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps, CardVariant };
