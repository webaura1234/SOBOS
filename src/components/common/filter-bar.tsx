'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4', className)}>
      {children}
    </div>
  );
}

interface FilterItemProps {
  label: string;
  children: ReactNode;
}

export function FilterItem({ label, children }: FilterItemProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
