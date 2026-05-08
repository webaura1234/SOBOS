import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'order' | 'restaurant' | 'staff';
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-50 text-gray-700 border-gray-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  preparing: 'bg-violet-50 text-violet-700 border-violet-200',
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  draft: 'bg-gray-50 text-gray-600 border-gray-200',
  paused: 'bg-orange-50 text-orange-700 border-orange-200',
  closed: 'bg-red-50 text-red-600 border-red-200',
  on_leave: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  in_stock: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  low_stock: 'bg-amber-50 text-amber-700 border-amber-200',
  out_of_stock: 'bg-red-50 text-red-700 border-red-200',
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/-/g, '_');

  return (
    <Badge
      variant="outline"
      className={cn('capitalize font-medium', statusStyles[normalizedStatus] || 'bg-muted text-muted-foreground')}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
