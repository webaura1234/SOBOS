'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  DollarSign,
  Package,
  ChefHat,
  Table2,
  Bell,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// ============================================================================
// Stat Card Widget
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label?: string };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  isLoading?: boolean;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  className,
  isLoading,
  footer,
  onClick,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-white hover:border-gray-300',
    success: 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300',
    warning: 'bg-amber-50/50 border-amber-200 hover:border-amber-300',
    danger: 'bg-red-50/50 border-red-200 hover:border-red-300',
    info: 'bg-blue-50/50 border-blue-200 hover:border-blue-300',
  };

  const iconVariants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  const trendColor =
    trend && trend.value > 0
      ? 'text-emerald-600'
      : trend && trend.value < 0
      ? 'text-red-600'
      : 'text-muted-foreground';

  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardContent className="p-6">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
          <div className="h-8 w-32 bg-muted rounded mb-2" />
          <div className="h-3 w-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card 
        className={cn(
          'border shadow-sm transition-all cursor-pointer',
          variantStyles[variant],
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2 min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {(trend || subtitle) && (
                <div className="flex items-center gap-1.5">
                  {trend && (
                    <span className={cn('flex items-center gap-0.5 text-xs font-medium', trendColor)}>
                      {trend.value > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : trend.value < 0 ? (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      ) : (
                        <Minus className="h-3.5 w-3.5" />
                      )}
                      {Math.abs(trend.value)}%
                    </span>
                  )}
                  {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
                </div>
              )}
            </div>
            {icon && (
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconVariants[variant])}>
                {icon}
              </div>
            )}
          </div>
          {footer && <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// KPI Card Widget
// ============================================================================

interface KPICardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ title, current, target, unit = '', icon, className }: KPICardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOnTrack = percentage >= 80;

  return (
    <Card className={cn('bg-white', className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {current.toLocaleString()}{unit} <span className="text-sm font-normal text-muted-foreground">/ {target.toLocaleString()}{unit}</span>
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn('font-medium', isOnTrack ? 'text-emerald-600' : 'text-amber-600')}>
              {percentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={cn('h-full rounded-full', isOnTrack ? 'bg-emerald-500' : 'bg-amber-500')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Activity Feed Widget
// ============================================================================

interface ActivityItem {
  id: string;
  type: 'order' | 'payment' | 'staff' | 'inventory' | 'alert' | 'system';
  title: string;
  description?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
  maxHeight?: number;
  isLoading?: boolean;
}

const activityIcons = {
  order: ShoppingBag,
  payment: DollarSign,
  staff: Users,
  inventory: Package,
  alert: AlertCircle,
  system: Activity,
};

const statusColors = {
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
};

export function ActivityFeed({ activities, className, maxHeight = 400, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activities.length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="px-6" style={{ maxHeight }}>
          <div className="space-y-4 pb-6">
            <AnimatePresence initial={false}>
              {activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 group"
                  >
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      statusColors[activity.status || 'info']
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Alert Widget
// ============================================================================

interface AlertWidgetProps {
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message?: string;
    action?: { label: string; onClick: () => void };
  }>;
  className?: string;
}

export function AlertWidget({ alerts, className }: AlertWidgetProps) {
  if (alerts.length === 0) return null;

  const alertStyles = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  const alertIcons = {
    warning: AlertCircle,
    error: AlertCircle,
    info: Activity,
    success: CheckCircle2,
  };

  return (
    <div className={cn('space-y-2', className)}>
      {alerts.map((alert) => {
        const Icon = alertIcons[alert.type];
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('rounded-lg border p-4 flex items-start gap-3', alertStyles[alert.type])}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{alert.title}</p>
              {alert.message && <p className="text-sm opacity-90 mt-1">{alert.message}</p>}
              {alert.action && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 mt-2 text-inherit underline"
                  onClick={alert.action.onClick}
                >
                  {alert.action.label}
                </Button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Real-time Status Widget
// ============================================================================

interface RealtimeStatusProps {
  isConnected: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function RealtimeStatus({ 
  isConnected, 
  lastUpdated, 
  onRefresh, 
  isRefreshing,
  className 
}: RealtimeStatusProps) {
  return (
    <div className={cn('flex items-center gap-3 text-sm', className)}>
      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-emerald-500" />
            <span className="text-emerald-600 font-medium">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-medium">Offline</span>
          </>
        )}
      </div>
      {lastUpdated && (
        <span className="text-muted-foreground">
          Updated {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      {onRefresh && (
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh data</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// ============================================================================
// Chart Widget Container
// ============================================================================

interface ChartWidgetProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function ChartWidget({ title, description, children, isLoading, className, action }: ChartWidgetProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Quick Actions Widget
// ============================================================================

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'primary' ? 'default' : 'outline'}
              className="h-auto py-3 px-4 justify-start gap-3"
              onClick={action.onClick}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Default export
export default {
  StatCard,
  KPICard,
  ActivityFeed,
  AlertWidget,
  RealtimeStatus,
  ChartWidget,
  QuickActions,
};
