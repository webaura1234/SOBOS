import { type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <div className={cn('flex items-center gap-1 text-sm', trend.isPositive ? 'text-emerald-600' : 'text-red-600')}>
                {trend.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          {icon && <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
