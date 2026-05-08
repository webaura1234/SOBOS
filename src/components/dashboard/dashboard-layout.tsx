'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { StatCard } from './dashboard-widgets';

// ============================================================================
// Dashboard Layout Wrapper
// ============================================================================

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6', className)}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Dashboard Header
// ============================================================================

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  breadcrumbs,
  actions,
  onRefresh,
  isRefreshing,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Dashboard Grid
// ============================================================================

interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export function DashboardGrid({
  children,
  columns = 4,
  gap = 'md',
  className,
}: DashboardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  return (
    <div className={cn('grid', gridCols[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Dashboard Section
// ============================================================================

interface DashboardSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DashboardSection({
  title,
  description,
  children,
  className,
  headerClassName,
}: DashboardSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className={headerClassName}>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// Dashboard Card
// ============================================================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

export function DashboardCard({
  title,
  description,
  children,
  className,
  headerAction,
  footer,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction}
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Stats Overview
// ============================================================================

interface Stat {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

interface StatsOverviewProps {
  stats: Stat[];
  className?: string;
  isLoading?: boolean;
}

export function StatsOverview({ stats, className, isLoading }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <DashboardGrid columns={4} className={className}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </DashboardGrid>
    );
  }

  return (
    <DashboardGrid columns={4} className={className}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </DashboardGrid>
  );
}

// Import StatCard from dashboard-widgets (import moved to top)

// Export default
export default {
  DashboardLayout,
  DashboardHeader,
  DashboardGrid,
  DashboardSection,
  DashboardCard,
  StatsOverview,
};
