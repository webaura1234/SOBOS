'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RevenueChartProps {
  data?: Array<{ date: string; revenue: number }>;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function RevenueChart({ data, title = 'Revenue Overview', description, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
                fontSize: '13px',
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="var(--primary)"
              fillOpacity={0.08}
              stroke="var(--primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
