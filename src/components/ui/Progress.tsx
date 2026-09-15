import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProgressVariant = 'linear' | 'circular';

interface ProgressProps {
  value: number; // 0-100
  variant?: ProgressVariant;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}

function LinearProgress({
  value,
  showLabel,
  color,
  className,
}: {
  value: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-muted font-medium">Progress</span>
          <span className="text-xs font-mono font-semibold text-text-primary">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            color || 'bg-gradient-to-r from-electric to-violet-light'
          )}
        />
      </div>
    </div>
  );
}

function CircularProgress({
  value,
  size = 64,
  strokeWidth = 4,
  showLabel,
  color,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-bg-secondary"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || 'url(#progress-gradient)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono font-bold text-text-primary"
            style={{ fontSize: size * 0.22 }}
          >
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
    </div>
  );
}

function Progress({
  variant = 'linear',
  ...props
}: ProgressProps) {
  if (variant === 'circular') {
    return <CircularProgress {...props} />;
  }
  return <LinearProgress {...props} />;
}

export { Progress, LinearProgress, CircularProgress };
export type { ProgressProps };
