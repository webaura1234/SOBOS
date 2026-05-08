import { tokens } from '@/styles/design-system';

/**
 * Design system utilities for RestaurantOS
 */

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export const spacing = tokens.spacing;
export const colors = tokens.colors;
export const shadows = tokens.shadows;
export const borderRadius = tokens.borderRadius;
export const typography = tokens.typography;

/**
 * Status color mapping for operational use
 */
export const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  active: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  inactive: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
  pending: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  confirmed: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  preparing: { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  ready: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  delivered: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  draft: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
  paused: { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
  closed: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  on_leave: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
};

/**
 * Chart color palette for data visualization
 */
export const chartColors = [
  '#0f172a',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
];

/**
 * Animation presets
 */
export const animations = {
  fadeIn: 'animate-fadeIn',
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',
  scaleIn: 'animate-scaleIn',
};
