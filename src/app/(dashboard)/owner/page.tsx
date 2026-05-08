'use client';

import {
  DashboardGrid,
  DashboardSection,
  DashboardCard,
} from '@/components/dashboard/dashboard-layout';
import { StatCard, ActivityFeed, AlertWidget, KPICard, QuickActions } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import {
  DollarSign,
  Users,
  ShoppingBag,
  ChefHat,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  AlertCircle,
  Calendar,
  Plus,
  UtensilsCrossed,
  Table2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';

// Mock data for restaurant owner
const restaurantStats = {
  todayRevenue: 4850,
  todayOrders: 142,
  activeStaff: 18,
  avgOrderValue: 34.15,
  occupancyRate: 78,
  customerRating: 4.7,
  pendingOrders: 8,
  lowStockItems: 5,
};

const hourlyRevenue = [
  { hour: '8AM', revenue: 450 },
  { hour: '9AM', revenue: 380 },
  { hour: '10AM', revenue: 520 },
  { hour: '11AM', revenue: 890 },
  { hour: '12PM', revenue: 1450 },
  { hour: '1PM', revenue: 1320 },
  { hour: '2PM', revenue: 680 },
  { hour: '3PM', revenue: 420 },
  { hour: '4PM', revenue: 380 },
  { hour: '5PM', revenue: 650 },
  { hour: '6PM', revenue: 1200 },
  { hour: '7PM', revenue: 1450 },
  { hour: '8PM', revenue: 1320 },
  { hour: '9PM', revenue: 980 },
  { hour: '10PM', revenue: 540 },
];

const weeklyComparison = [
  { day: 'Mon', current: 4200, previous: 3800 },
  { day: 'Tue', current: 5100, previous: 4200 },
  { day: 'Wed', current: 4850, previous: 4500 },
  { day: 'Thu', current: 5600, previous: 4900 },
  { day: 'Fri', current: 7200, previous: 6500 },
  { day: 'Sat', current: 8900, previous: 7800 },
  { day: 'Sun', current: 7400, previous: 6800 },
];

const recentActivity = [
  {
    id: '1',
    type: 'order' as const,
    title: 'New order received',
    description: '#12345 - $156.50 - Table 12',
    timestamp: '2 minutes ago',
    status: 'success' as const,
  },
  {
    id: '2',
    type: 'payment' as const,
    title: 'Payment processed',
    description: 'Order #12344 completed - $89.00',
    timestamp: '5 minutes ago',
    status: 'success' as const,
  },
  {
    id: '3',
    type: 'alert' as const,
    title: 'Low stock alert',
    description: 'Chicken Breast - Only 2kg remaining',
    timestamp: '10 minutes ago',
    status: 'warning' as const,
  },
  {
    id: '4',
    type: 'staff' as const,
    title: 'Staff checked in',
    description: 'Chef Marco started shift',
    timestamp: '15 minutes ago',
    status: 'info' as const,
  },
  {
    id: '5',
    type: 'order' as const,
    title: 'Order ready for pickup',
    description: 'Order #12343 - Delivery',
    timestamp: '18 minutes ago',
    status: 'success' as const,
  },
];

const alerts = [
  {
    id: '1',
    type: 'warning' as const,
    title: '5 items running low on stock',
    message: 'Review inventory and reorder soon',
    action: { label: 'View Inventory', onClick: () => {} },
  },
  { id: '2', type: 'info' as const, title: 'Peak hours approaching', message: 'Expected high volume from 6-9 PM' },
];

const topSellingItems = [
  { name: 'Grilled Salmon', sold: 48, revenue: 1440 },
  { name: 'Truffle Pasta', sold: 42, revenue: 1260 },
  { name: 'Ribeye Steak', sold: 38, revenue: 1900 },
  { name: 'Caesar Salad', sold: 36, revenue: 540 },
  { name: 'Chocolate Lava Cake', sold: 32, revenue: 448 },
];

export default function RestaurantOwnerDashboardPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const router = useRouter();

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  return (
    <>
      <DashboardHeader
        title="Bella Vista Restaurant"
        description="Owner Dashboard - Today's overview"
        onRefresh={handleRefresh}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
            <Button size="sm" onClick={() => router.push(ROUTES.protected.orders)}>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        }
      />

      <AlertWidget
        alerts={alerts.map((alert) =>
          alert.id === '1'
            ? { ...alert, action: { label: 'View Inventory', onClick: () => router.push('/inventory') } }
            : alert
        )}
      />

      <DashboardGrid columns={4}>
        <StatCard
          title="Today's Revenue"
          value={`$${restaurantStats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12.5, label: 'vs yesterday' }}
          variant="success"
        />
        <StatCard
          title="Today's Orders"
          value={restaurantStats.todayOrders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: 8.3, label: 'vs yesterday' }}
          variant="info"
        />
        <StatCard
          title="Active Staff"
          value={restaurantStats.activeStaff.toString()}
          icon={<Users className="h-5 w-5" />}
          subtitle="Currently on shift"
        />
        <StatCard
          title="Avg Order Value"
          value={`$${restaurantStats.avgOrderValue}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 5.2, label: 'vs last week' }}
          variant="success"
        />
      </DashboardGrid>

      <DashboardGrid columns={4}>
        <KPICard
          title="Revenue Target"
          current={restaurantStats.todayRevenue}
          target={6000}
          unit="$"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Table Occupancy"
          current={restaurantStats.occupancyRate}
          target={85}
          unit="%"
          icon={<Table2 className="h-5 w-5" />}
        />
        <KPICard
          title="Customer Rating"
          current={restaurantStats.customerRating}
          target={4.8}
          unit=""
          icon={<Star className="h-5 w-5" />}
        />
        <KPICard
          title="Pending Orders"
          current={restaurantStats.pendingOrders}
          target={10}
          unit=""
          icon={<Clock className="h-5 w-5" />}
        />
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Hourly Revenue</CardTitle>
                <CardDescription>Today&apos;s revenue by hour</CardDescription>
              </div>
              <Badge variant="outline">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${Number(value)}`, 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Weekly Comparison</CardTitle>
                <CardDescription>This week vs last week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="This Week" />
                <Bar dataKey="previous" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Last Week" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </DashboardGrid>

      <DashboardGrid columns={3}>
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

        <ActivityFeed activities={recentActivity.slice(0, 6)} maxHeight={320} />

        <QuickActions
          actions={[
            {
              label: 'New Order',
              icon: <Plus className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.orders),
              variant: 'primary',
            },
            {
              label: 'Manage Menu',
              icon: <UtensilsCrossed className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.menu),
            },
            {
              label: 'Staff Schedule',
              icon: <Users className="h-4 w-4" />,
              onClick: () => router.push(`${ROUTES.protected.staff}?tab=schedule`),
            },
            { label: 'Inventory', icon: <AlertCircle className="h-4 w-4" />, onClick: () => router.push('/inventory') },
            {
              label: 'Reports',
              icon: <TrendingUp className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.reports),
            },
            {
              label: 'Settings',
              icon: <Clock className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.settings),
            },
          ]}
        />
      </DashboardGrid>

      <DashboardSection title="Live Kitchen Status">
        <DashboardGrid columns={4}>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-800 font-medium">Preparing</p>
                  <p className="text-2xl font-bold text-amber-900">8</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
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
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-800 font-medium">Served</p>
                  <p className="text-2xl font-bold text-emerald-900">142</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
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
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </DashboardGrid>
      </DashboardSection>
    </>
  );
}
