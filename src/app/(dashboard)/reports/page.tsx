'use client';

import { PageHeader, StatCard } from '@/components/common';
import { LoadingSkeleton, ChartSkeleton } from '@/components/feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRevenueReport } from '@/hooks/api';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ReportsPage() {
  const { data, isLoading, error } = useRevenueReport({ groupBy: 'day' });

  if (isLoading) return <LoadingSkeleton type="page" />;
  
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" description="Performance and analytics" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">Failed to load reports. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Default mock data if no data is returned
  const report = (data?.data as Record<string, unknown>) || {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Performance and analytics" />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Revenue" value={`$${((report?.totalRevenue as number) || 0).toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Total Orders" value={((report?.totalOrders as number) || 0).toLocaleString()} icon={<PieChart className="h-5 w-5" />} />
        <StatCard title="Avg Order Value" value={`$${((report?.avgOrderValue as number) || 0).toFixed(2)}`} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              {report?.revenueData ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={report.revenueData as Array<Record<string, unknown>>}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" fill="var(--primary)" fillOpacity={0.1} stroke="var(--primary)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ChartSkeleton />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
              <CardDescription>Daily order volume</CardDescription>
            </CardHeader>
            <CardContent>
              {report?.orderData ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={report.orderData as Array<Record<string, unknown>>}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartSkeleton />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Performance</CardTitle>
              <CardDescription>Top performing menu items</CardDescription>
            </CardHeader>
            <CardContent>
              {report?.topItems ? (
                <div className="space-y-4">
                  {(report.topItems as Array<Record<string, unknown>>).map((item: Record<string, unknown>, index: number) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                      <span className="font-medium">{String(item.name || 'Unknown')}</span>
                      <span className="text-sm text-muted-foreground">{String(item.count || 0)} sold</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
