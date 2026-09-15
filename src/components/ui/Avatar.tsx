import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  level?: number;
  online?: boolean;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2 -right-0 -bottom-0' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5 -right-0.5 -bottom-0.5' },
  lg: { container: 'w-12 h-12', text: 'text-base', dot: 'w-3 h-3 -right-0.5 -bottom-0.5' },
  xl: { container: 'w-16 h-16', text: 'text-lg', dot: 'w-3.5 h-3.5 -right-0.5 -bottom-0.5' },
};

const levelRingColors: Record<number, string> = {
  1: 'ring-electric',
  2: 'ring-neon',
  3: 'ring-violet',
  4: 'ring-gold',
  5: 'ring-rose',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getLevelColor(level: number): string {
  if (level <= 5) return levelRingColors[level] || 'ring-electric';
  if (level <= 10) return 'ring-neon';
  if (level <= 20) return 'ring-violet';
  if (level <= 30) return 'ring-gold';
  return 'ring-rose';
}

function Avatar({ src, name, size = 'md', level, online, className }: AvatarProps) {
  const styles = sizeStyles[size];
  const initials = name ? getInitials(name) : '?';
  const hasRing = level !== undefined && level > 0;
  const ringColor = hasRing ? getLevelColor(level) : '';

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center',
          'bg-gradient-to-br from-electric/20 to-violet/20',
          styles.container,
          hasRing && `ring-2 ${ringColor} ring-offset-2 ring-offset-bg-primary`
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={cn(
              'font-semibold text-text-primary select-none',
              styles.text
            )}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Online indicator */}
      {online && (
        <span
          className={cn(
            'absolute rounded-full bg-neon border-2 border-bg-primary',
            styles.dot
          )}
        />
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps, AvatarSize };
