import { PredClass } from '@/types/api';
import { PT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface PredictionBadgeProps {
  predClass: PredClass;
  className?: string;
}

const badgeStyles: Record<PredClass, string> = {
  H: 'bg-emerald text-emerald-foreground',
  D: 'bg-muted-foreground text-card',
  A: 'bg-primary text-primary-foreground',
};

export function PredictionBadge({ predClass, className }: PredictionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        badgeStyles[predClass],
        className
      )}
    >
      {PT.predClass[predClass]}
    </span>
  );
}
