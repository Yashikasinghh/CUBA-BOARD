import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon: Icon,
      rightElement,
      className,
      type = 'text',
      placeholder,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';
    const isActive = isFocused || hasValue;

    return (
      <div className="w-full">
        <div className="relative">
          {/* Icon */}
          {Icon && (
            <div
              className={cn(
                'absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none z-10',
                isFocused ? 'text-electric' : 'text-text-muted'
              )}
            >
              <Icon size={18} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            value={value}
            placeholder={label ? (isActive ? placeholder : '') : placeholder}
            className={cn(
              'w-full bg-bg-secondary border rounded-xl px-4 py-3',
              'text-text-primary text-sm placeholder:text-text-muted',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-electric/50 focus:border-electric/50',
              'hover:border-border/80',
              Icon && 'pl-11',
              rightElement && 'pr-11',
              label && 'pt-5 pb-2',
              error
                ? 'border-rose focus:ring-rose/50 focus:border-rose/50'
                : 'border-border',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <motion.label
              initial={false}
              animate={{
                y: isActive ? -8 : 0,
                scale: isActive ? 0.8 : 1,
                color: error
                  ? '#f43f5e'
                  : isFocused
                    ? '#3b82f6'
                    : '#64748b',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 origin-left pointer-events-none',
                'text-sm font-medium',
                Icon ? 'left-11' : 'left-4'
              )}
            >
              {label}
            </motion.label>
          )}

          {/* Right Element */}
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.15 }}
              className="text-rose text-xs mt-1.5 pl-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
export type { InputProps };
