'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label?: string };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  isLoading?: boolean;
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  className,
  isLoading,
}: AnalyticsCardProps) {
  const variantStyles = {
    default: 'bg-white',
    success: 'bg-emerald-50/50 border-emerald-200',
    warning: 'bg-amber-50/50 border-amber-200',
    danger: 'bg-red-50/50 border-red-200',
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
    >
      <Card className={cn('border shadow-sm hover:shadow-md transition-shadow', variantStyles[variant], className)}>
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
