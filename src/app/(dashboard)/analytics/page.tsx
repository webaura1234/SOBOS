'use client';

import { DashboardLayout, DashboardHeader, DashboardGrid, DashboardSection, DashboardCard } from '@/components/dashboard/dashboard-layout';
import { StatCard, ChartWidget, ActivityFeed } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RePieChart, Pie, Cell, ComposedChart } from 'recharts';

// Mock analytics data
const revenueData = [
  { date: 'Mon', revenue: 4500, orders: 120, customers: 85 },
  { date: 'Tue', revenue: 5200, orders: 145, customers: 98 },
  { date: 'Wed', revenue: 4800, orders: 132, customers: 92 },
  { date: 'Thu', revenue: 6100, orders: 168, customers: 115 },
  { date: 'Fri', revenue: 7800, orders: 210, customers: 142 },
  { date: 'Sat', revenue: 9200, orders: 245, customers: 168 },
  { date: 'Sun', revenue: 8500, orders: 225, customers: 155 },
];

const monthlyData = [
  { month: 'Jan', revenue: 125000, orders: 3200, target: 120000 },
  { month: 'Feb', revenue: 138000, orders: 3500, target: 130000 },
  { month: 'Mar', revenue: 142000, orders: 3650, target: 140000 },
  { month: 'Apr', revenue: 155000, orders: 3900, target: 150000 },
  { month: 'May', revenue: 168000, orders: 4200, target: 160000 },
  { month: 'Jun', revenue: 175000, orders: 4450, target: 170000 },
];

const categoryPerformance = [
  { name: 'Appetizers', revenue: 45000, orders: 1200, avgOrder: 37.5 },
  { name: 'Main Course', revenue: 125000, orders: 2100, avgOrder: 59.5 },
  { name: 'Desserts', revenue: 28000, orders: 850, avgOrder: 32.9 },
  { name: 'Beverages', revenue: 32000, orders: 1800, avgOrder: 17.8 },
  { name: 'Sides', revenue: 18000, orders: 950, avgOrder: 18.9 },
];

const paymentMethodData = [
  { name: 'Credit Card', value: 45, color: '#3b82f6' },
  { name: 'Cash', value: 25, color: '#22c55e' },
  { name: 'Mobile Pay', value: 20, color: '#8b5cf6' },
  { name: 'Online', value: 10, color: '#f59e0b' },
];

const hourlyPeakData = [
  { hour: '6AM', orders: 5, revenue: 150 },
  { hour: '7AM', orders: 8, revenue: 240 },
  { hour: '8AM', orders: 15, revenue: 450 },
  { hour: '9AM', orders: 22, revenue: 660 },
  { hour: '10AM', orders: 35, revenue: 1050 },
  { hour: '11AM', orders: 58, revenue: 1740 },
  { hour: '12PM', orders: 125, revenue: 3750 },
  { hour: '1PM', orders: 98, revenue: 2940 },
  { hour: '2PM', orders: 45, revenue: 1350 },
  { hour: '3PM', orders: 32, revenue: 960 },
  { hour: '4PM', orders: 28, revenue: 840 },
  { hour: '5PM', orders: 65, revenue: 1950 },
  { hour: '6PM', orders: 145, revenue: 4350 },
  { hour: '7PM', orders: 168, revenue: 5040 },
  { hour: '8PM', orders: 142, revenue: 4260 },
  { hour: '9PM', orders: 85, revenue: 2550 },
  { hour: '10PM', orders: 45, revenue: 1350 },
];

const kpiData = [
  { title: 'Total Revenue', value: '$1.24M', trend: 12.5, icon: DollarSign },
  { title: 'Total Orders', value: '28.5K', trend: 8.3, icon: ShoppingBag },
  { title: 'Avg Order Value', value: '$43.50', trend: 4.2, icon: TrendingUp },
  { title: 'Unique Customers', value: '8.2K', trend: 15.8, icon: Users },
];

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Analytics Dashboard"
        description="Deep insights into restaurant performance"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <DashboardGrid columns={4}>
        {kpiData.map((kpi, index) => (
          <StatCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={<kpi.icon className="h-5 w-5" />}
            trend={{ value: kpi.trend, label: 'vs last period' }}
            variant={kpi.trend > 0 ? 'success' : 'default'}
          />
        ))}
      </DashboardGrid>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="menu">Menu Performance</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardGrid columns={2}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Revenue Overview</CardTitle>
                    <CardDescription>Daily revenue, orders, and customers</CardDescription>
                  </div>
                  <Badge variant="outline">Last 7 Days</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#888" fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Peak Hours</CardTitle>
                    <CardDescription>Order volume by hour of day</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyPeakData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#888" fontSize={10} interval={2} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </DashboardGrid>

          <DashboardGrid columns={3}>
            <DashboardCard title="Payment Methods" description="Revenue by payment type">
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {paymentMethodData.map((method) => (
                  <div key={method.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                      <span className="text-sm">{method.name}</span>
                    </div>
                    <span className="text-sm font-medium">{method.value}%</span>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Monthly Performance" description="Revenue vs target">
              <div className="space-y-4">
                {monthlyData.slice(-4).map((month) => (
                  <div key={month.month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-sm text-muted-foreground">
                        ${(month.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min((month.revenue / month.target) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        Target: ${(month.target / 1000).toFixed(0)}k
                      </span>
                      <span className={month.revenue >= month.target ? 'text-emerald-600 text-xs' : 'text-amber-600 text-xs'}>
                        {month.revenue >= month.target ? '+' : ''}{((month.revenue - month.target) / month.target * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Key Metrics" description="Today's performance">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Revenue Target</span>
                    <span className="text-sm font-medium">81%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Table Turnover</span>
                    <span className="text-sm font-medium">3.2x</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Staff Efficiency</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </DashboardCard>
          </DashboardGrid>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
              <CardDescription>6-month revenue comparison with targets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Performance</CardTitle>
              <CardDescription>Revenue and order metrics by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {categoryPerformance.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between py-4">
                    <div className="flex-1">
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-sm text-muted-foreground">{cat.orders.toLocaleString()} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${cat.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Avg: ${cat.avgOrder}</p>
                    </div>
                    <div className="ml-4 w-32">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(cat.revenue / 150000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <DashboardGrid columns={2}>
            <DashboardCard title="Customer Trends" description="New vs returning customers">
              <ResponsiveContainer width="100%" height={250}>
                <ReLineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} name="Customers" />
                </ReLineChart>
              </ResponsiveContainer>
            </DashboardCard>

            <DashboardCard title="Customer Metrics" description="Key customer insights">
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Customers</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">1,245</span>
                    <Badge className="bg-emerald-100 text-emerald-800">+12%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Returning Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">68%</span>
                    <Badge className="bg-emerald-100 text-emerald-800">+5%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Visit Frequency</span>
                  <span className="font-medium">2.4 / month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Lifetime Value</span>
                  <span className="font-medium">$342</span>
                </div>
              </div>
            </DashboardCard>
          </DashboardGrid>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
