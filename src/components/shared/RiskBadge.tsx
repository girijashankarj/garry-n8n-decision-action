import { Badge } from '@/components/ui/badge';
import type { ImpactLevel } from '@/types/decision.types';

interface RiskBadgeProps {
  level: ImpactLevel | 'critical';
  label?: string;
}

export function RiskBadge({ level, label }: RiskBadgeProps) {
  const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
    critical: 'destructive',
  };

  const colorMap: Record<string, string> = {
    low: 'bg-green-500/20 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    high: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
    critical: 'bg-red-500/20 text-red-700 dark:text-red-400',
  };

  return (
    <Badge variant={variantMap[level] || 'default'} className={colorMap[level]}>
      {label || level.toUpperCase()}
    </Badge>
  );
}
