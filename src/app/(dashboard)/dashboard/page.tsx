'use client';

import { DashboardLayout, DashboardHeader, DashboardGrid, DashboardSection, DashboardCard } from '@/components/dashboard/dashboard-layout';
import { StatCard, ActivityFeed, AlertWidget, KPICard, QuickActions } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Store,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  ChefHat,
  Plus,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  UtensilsCrossed,
  Package,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

// Mock data
const dashboardStats = {
  todayRevenue: 4850,
  todayOrders: 142,
  activeTables: 8,
  activeStaff: 18,
  avgOrderValue: 34.15,
  customerRating: 4.7,
};

const hourlyData = [
  { hour: '8AM', revenue: 450, orders: 12 },
  { hour: '9AM', revenue: 380, orders: 10 },
  { hour: '10AM', revenue: 520, orders: 14 },
  { hour: '11AM', revenue: 890, orders: 25 },
  { hour: '12PM', revenue: 1450, orders: 42 },
  { hour: '1PM', revenue: 1320, orders: 38 },
  { hour: '2PM', revenue: 680, orders: 20 },
  { hour: '3PM', revenue: 420, orders: 12 },
  { hour: '4PM', revenue: 380, orders: 11 },
  { hour: '5PM', revenue: 650, orders: 18 },
  { hour: '6PM', revenue: 1200, orders: 32 },
  { hour: '7PM', revenue: 1450, orders: 38 },
];

const weeklyData = [
  { day: 'Mon', revenue: 4200, orders: 120 },
  { day: 'Tue', revenue: 5100, orders: 145 },
  { day: 'Wed', revenue: 4850, orders: 142 },
  { day: 'Thu', revenue: 5600, orders: 158 },
  { day: 'Fri', revenue: 7200, orders: 195 },
  { day: 'Sat', revenue: 8900, orders: 245 },
  { day: 'Sun', revenue: 7400, orders: 210 },
];

const orderTypeDistribution = [
  { name: 'Dine-in', value: 55, color: '#3b82f6' },
  { name: 'Delivery', value: 30, color: '#8b5cf6' },
  { name: 'Takeaway', value: 15, color: '#f59e0b' },
];

const recentOrders = [
  { id: '1', number: 'ORD-2024-0156', table: 'T-12', items: 4, total: 156.50, status: 'served', time: '12:30 PM' },
  { id: '2', number: 'ORD-2024-0157', table: 'T-08', items: 3, total: 89.00, status: 'preparing', time: '12:45 PM' },
  { id: '3', number: 'ORD-2024-0158', table: 'T-05', items: 2, total: 67.50, status: 'ready', time: '1:00 PM' },
  { id: '4', number: 'ORD-2024-0159', table: null, items: 5, total: 124.00, status: 'confirmed', time: '1:15 PM' },
  { id: '5', number: 'ORD-2024-0160', table: 'T-15', items: 6, total: 234.00, status: 'preparing', time: '1:30 PM' },
];

const recentActivity = [
  { id: '1', type: 'order' as const, title: 'New order received', description: '#12345 - $156.50 - Table 12', timestamp: '2 minutes ago', status: 'success' as const },
  { id: '2', type: 'payment' as const, title: 'Payment processed', description: 'Order #12344 completed - $89.00', timestamp: '5 minutes ago', status: 'success' as const },
  { id: '3', type: 'alert' as const, title: 'Low stock alert', description: 'Chicken Breast - Only 2kg remaining', timestamp: '10 minutes ago', status: 'warning' as const },
  { id: '4', type: 'staff' as const, title: 'Staff checked in', description: 'Chef Marco started shift', timestamp: '15 minutes ago', status: 'info' as const },
  { id: '5', type: 'order' as const, title: 'Order ready for pickup', description: 'Order #12343 - Delivery', timestamp: '18 minutes ago', status: 'success' as const },
];

const alerts = [
  { id: '1', type: 'warning' as const, title: '5 items running low on stock', message: 'Review inventory and reorder soon', action: { label: 'View Inventory', onClick: () => {} } },
  { id: '2', type: 'info' as const, title: 'Peak hours approaching', message: 'Expected high volume from 6-9 PM' },
];

const topSellingItems = [
  { name: 'Grilled Salmon', sold: 48, revenue: 1440 },
  { name: 'Truffle Pasta', sold: 42, revenue: 1260 },
  { name: 'Ribeye Steak', sold: 38, revenue: 1900 },
  { name: 'Caesar Salad', sold: 36, revenue: 540 },
  { name: 'Chocolate Lava Cake', sold: 32, revenue: 448 },
];

export default function MainDashboardPage() {
  const [activeTab, setActiveTab] = useState('today');

  const statusColors: Record<string, string> = {
    served: 'bg-emerald-100 text-emerald-800',
    preparing: 'bg-amber-100 text-amber-800',
    ready: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-gray-100 text-gray-800',
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard"
        description="Overview of your restaurant operations"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        }
      />

      <AlertWidget alerts={alerts} />

      <DashboardGrid columns={4}>
        <StatCard
          title="Today's Revenue"
          value={`$${dashboardStats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12.5, label: 'vs yesterday' }}
          variant="success"
        />
        <StatCard
          title="Today's Orders"
          value={dashboardStats.todayOrders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: 8.3, label: 'vs yesterday' }}
          variant="info"
        />
        <StatCard
          title="Active Tables"
          value={dashboardStats.activeTables.toString()}
          icon={<Store className="h-5 w-5" />}
          subtitle={`${18 - dashboardStats.activeTables} available`}
        />
        <StatCard
          title="Active Staff"
          value={dashboardStats.activeStaff.toString()}
          icon={<Users className="h-5 w-5" />}
          subtitle="Currently on shift"
        />
      </DashboardGrid>

      <DashboardGrid columns={3}>
        <KPICard
          title="Revenue Target"
          current={dashboardStats.todayRevenue}
          target={6000}
          unit="$"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Order Target"
          current={dashboardStats.todayOrders}
          target={180}
          unit=""
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <KPICard
          title="Customer Rating"
          current={dashboardStats.customerRating}
          target={4.8}
          unit=""
          icon={<Star className="h-5 w-5" />}
        />
      </DashboardGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <DashboardGrid columns={2}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Hourly Revenue</CardTitle>
                    <CardDescription>Today's performance by hour</CardDescription>
                  </div>
                  <Badge variant="outline">Live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(v) => [`$${Number(v)}`, 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Order Types</CardTitle>
                    <CardDescription>Distribution by order channel</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={orderTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {orderTypeDistribution.map((type) => (
                    <div key={type.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm text-muted-foreground">{type.name} ({type.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </DashboardGrid>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Performance</CardTitle>
              <CardDescription>Revenue and orders for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#888" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar yAxisId="right" dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <Card className="p-8">
            <div className="text-center">
              <p className="text-muted-foreground">Monthly analytics view coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <DashboardGrid columns={3}>
        <DashboardCard title="Recent Orders" description="Latest orders across all channels">
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    {order.table || 'D'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{order.number}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">${order.total.toFixed(2)}</p>
                  <Badge className={`text-xs ${statusColors[order.status]}`}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Top Selling Items" description="Today's best performers">
          <div className="space-y-3">
            {topSellingItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.sold} sold</p>
                  <p className="text-xs text-muted-foreground">${item.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="space-y-4">
          <ActivityFeed activities={recentActivity} maxHeight={280} />
        </div>
      </DashboardGrid>

      <DashboardSection title="Kitchen Status">
        <DashboardGrid columns={4}>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-800 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-emerald-900">128</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-800 font-medium">Preparing</p>
                  <p className="text-2xl font-bold text-amber-900">12</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <ChefHat className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 font-medium">Ready</p>
                  <p className="text-2xl font-bold text-blue-900">3</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-800 font-medium">Delayed</p>
                  <p className="text-2xl font-bold text-red-900">1</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </DashboardGrid>
      </DashboardSection>

      <QuickActions
        actions={[
          { label: 'New Order', icon: <Plus className="h-4 w-4" />, onClick: () => {}, variant: 'primary' },
          { label: 'Manage Menu', icon: <UtensilsCrossed className="h-4 w-4" />, onClick: () => {} },
          { label: 'View Tables', icon: <Store className="h-4 w-4" />, onClick: () => {} },
          { label: 'Inventory', icon: <Package className="h-4 w-4" />, onClick: () => {} },
          { label: 'Staff', icon: <Users className="h-4 w-4" />, onClick: () => {} },
          { label: 'Reports', icon: <TrendingUp className="h-4 w-4" />, onClick: () => {} },
        ]}
      />
    </DashboardLayout>
  );
}
