'use client';

import { PageHeader, StatCard } from '@/components/common';
import { LoadingSkeleton, ChartSkeleton } from '@/components/feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRevenueReport } from '@/hooks/api';
import { DollarSign, TrendingUp, PieChart, Users, Receipt } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts';

type TrendPoint = {
  date: string;
  revenue: number;
  orders: number;
};

type HourlyPoint = {
  hour: string;
  sales: number;
};

type TopItem = {
  name: string;
  count: number;
  revenue: number;
};

type ReportData = {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalCustomers: number;
  repeatCustomerRate: number;
  revenueData: TrendPoint[];
  orderData: TrendPoint[];
  hourlySales: HourlyPoint[];
  topItems: TopItem[];
};

const demoReport: ReportData = {
  totalRevenue: 182450,
  totalOrders: 2384,
  avgOrderValue: 76.53,
  totalCustomers: 1326,
  repeatCustomerRate: 42,
  revenueData: [
    { date: 'Mon', revenue: 19800, orders: 248 },
    { date: 'Tue', revenue: 22400, orders: 281 },
    { date: 'Wed', revenue: 23650, orders: 302 },
    { date: 'Thu', revenue: 25800, orders: 338 },
    { date: 'Fri', revenue: 31100, orders: 420 },
    { date: 'Sat', revenue: 34300, orders: 456 },
    { date: 'Sun', revenue: 25400, orders: 339 },
  ],
  orderData: [
    { date: 'Mon', revenue: 19800, orders: 248 },
    { date: 'Tue', revenue: 22400, orders: 281 },
    { date: 'Wed', revenue: 23650, orders: 302 },
    { date: 'Thu', revenue: 25800, orders: 338 },
    { date: 'Fri', revenue: 31100, orders: 420 },
    { date: 'Sat', revenue: 34300, orders: 456 },
    { date: 'Sun', revenue: 25400, orders: 339 },
  ],
  hourlySales: [
    { hour: '10 AM', sales: 2400 },
    { hour: '11 AM', sales: 3300 },
    { hour: '12 PM', sales: 6100 },
    { hour: '1 PM', sales: 7900 },
    { hour: '2 PM', sales: 5200 },
    { hour: '6 PM', sales: 6800 },
    { hour: '7 PM', sales: 9300 },
    { hour: '8 PM', sales: 10100 },
    { hour: '9 PM', sales: 6400 },
  ],
  topItems: [
    { name: 'Chicken Biryani', count: 332, revenue: 39840 },
    { name: 'Paneer Butter Masala', count: 268, revenue: 29480 },
    { name: 'Veg Fried Rice', count: 241, revenue: 21690 },
    { name: 'Mutton Curry', count: 196, revenue: 31360 },
    { name: 'Butter Naan', count: 584, revenue: 11680 },
  ],
};

export default function ReportsPage() {
  const { data, isLoading, error } = useRevenueReport({ groupBy: 'day' });

  if (isLoading) return <LoadingSkeleton type="page" />;

  const apiReport = data?.data as Partial<ReportData> | undefined;
  const report: ReportData = {
    ...demoReport,
    ...apiReport,
    revenueData: apiReport?.revenueData ?? demoReport.revenueData,
    orderData: apiReport?.orderData ?? demoReport.orderData,
    hourlySales: apiReport?.hourlySales ?? demoReport.hourlySales,
    topItems: apiReport?.topItems ?? demoReport.topItems,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Performance and analytics" />
      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Live report API is unavailable. Showing demo insights to preview the owner dashboard.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Revenue"
          value={`$${report.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Total Orders"
          value={report.totalOrders.toLocaleString()}
          icon={<PieChart className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Order Value"
          value={`$${report.avgOrderValue.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Customers"
          value={report.totalCustomers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard title="Repeat Rate" value={`${report.repeatCustomerRate}%`} icon={<Receipt className="h-5 w-5" />} />
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
              <CardDescription>Daily revenue performance for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              {report.revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={report.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      fill="var(--primary)"
                      fillOpacity={0.1}
                      stroke="var(--primary)"
                    />
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
              <CardDescription>Daily order volume to monitor demand patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {report.orderData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={report.orderData}>
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
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
              <CardDescription>Hourly sales to help staff and kitchen planning</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.hourlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Performance</CardTitle>
              <CardDescription>Top performing items by quantity sold and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {report.topItems.length > 0 ? (
                <div className="space-y-4">
                  {report.topItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.count} sold</p>
                      </div>
                      <span className="text-sm font-medium text-emerald-600">${item.revenue.toLocaleString()}</span>
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
