'use client';

import {
  DashboardHeader,
  DashboardGrid,
  DashboardSection,
} from '@/components/dashboard/dashboard-layout';
import {
  StatCard,
  ActivityFeed,
  AlertWidget,
  RealtimeStatus,
  KPICard,
  QuickActions,
} from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Server,
  Shield,
  Zap,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for platform admin
const platformStats = {
  totalRestaurants: 156,
  totalUsers: 2847,
  totalRevenue: 1247500,
  activeLocations: 342,
  mrr: 45000,
  churnRate: 2.3,
  supportTickets: 12,
  systemUptime: 99.98,
};

const revenueData = [
  { month: 'Jan', revenue: 35000, restaurants: 120 },
  { month: 'Feb', revenue: 38000, restaurants: 128 },
  { month: 'Mar', revenue: 42000, restaurants: 135 },
  { month: 'Apr', revenue: 40000, restaurants: 142 },
  { month: 'May', revenue: 45000, restaurants: 148 },
  { month: 'Jun', revenue: 48000, restaurants: 156 },
];

const planDistribution = [
  { name: 'Basic', value: 45, color: '#3b82f6' },
  { name: 'Professional', value: 78, color: '#8b5cf6' },
  { name: 'Enterprise', value: 33, color: '#f59e0b' },
];

const recentActivity = [
  {
    id: '1',
    type: 'system' as const,
    title: 'New restaurant onboarded',
    description: 'Bella Vista Restaurant joined',
    timestamp: '2 minutes ago',
    status: 'success' as const,
  },
  {
    id: '2',
    type: 'alert' as const,
    title: 'High server load detected',
    description: 'Database connections at 85%',
    timestamp: '5 minutes ago',
    status: 'warning' as const,
  },
  {
    id: '3',
    type: 'payment' as const,
    title: 'Subscription payment received',
    description: "$299 from Luigi's Kitchen",
    timestamp: '10 minutes ago',
    status: 'success' as const,
  },
  {
    id: '4',
    type: 'staff' as const,
    title: 'New staff member added',
    description: 'Sarah Johnson at Downtown Grill',
    timestamp: '15 minutes ago',
    status: 'info' as const,
  },
  {
    id: '5',
    type: 'order' as const,
    title: 'Large order processed',
    description: '$1,250 order at The Steakhouse',
    timestamp: '20 minutes ago',
    status: 'success' as const,
  },
];

const alerts = [
  {
    id: '1',
    type: 'warning' as const,
    title: '3 restaurants approaching billing limit',
    message: 'Restaurants with high usage need attention',
    action: { label: 'Review', onClick: () => {} },
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'System maintenance scheduled',
    message: 'Planned maintenance tonight at 2 AM EST',
  },
];

export default function PlatformAdminDashboardPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const router = useRouter();

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  return (
    <>
      <DashboardHeader
        title="Platform Admin Dashboard"
        description="Overview of all restaurants and system health"
        onRefresh={handleRefresh}
        actions={
          <div className="flex items-center gap-2">
            <RealtimeStatus isConnected={isConnected} lastUpdated={lastUpdated} onRefresh={handleRefresh} />
            <Button size="sm" onClick={() => router.push('/restaurants?action=add')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </div>
        }
      />

      <AlertWidget
        alerts={alerts.map((alert) =>
          alert.id === '1'
            ? { ...alert, action: { label: 'Review', onClick: () => router.push('/admin?tab=billing') } }
            : alert
        )}
      />

      <DashboardGrid columns={4}>
        <StatCard
          title="Total Restaurants"
          value={platformStats.totalRestaurants.toLocaleString()}
          icon={<Building2 className="h-5 w-5" />}
          trend={{ value: 12, label: 'vs last month' }}
          variant="info"
        />
        <StatCard
          title="Total Users"
          value={platformStats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8.5, label: 'vs last month' }}
          variant="default"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${platformStats.mrr.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 15.3, label: 'vs last month' }}
          variant="success"
        />
        <StatCard
          title="System Uptime"
          value={`${platformStats.systemUptime}%`}
          icon={<Server className="h-5 w-5" />}
          subtitle="Last 30 days"
          variant="success"
        />
      </DashboardGrid>

      <DashboardGrid columns={3}>
        <KPICard
          title="Revenue Target"
          current={45000}
          target={50000}
          unit="$"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Restaurant Growth"
          current={156}
          target={200}
          unit=""
          icon={<Building2 className="h-5 w-5" />}
        />
        <KPICard title="Support SLA" current={98} target={95} unit="%" icon={<Shield className="h-5 w-5" />} />
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Revenue & Growth</CardTitle>
                <CardDescription>Monthly revenue and restaurant count</CardDescription>
              </div>
              <Badge variant="outline">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Plan Distribution</CardTitle>
                <CardDescription>Active subscriptions by plan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm text-muted-foreground">
                    {plan.name} ({plan.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <ActivityFeed activities={recentActivity} maxHeight={400} />

        <QuickActions
          actions={[
            {
              label: 'Add Restaurant',
              icon: <Building2 className="h-4 w-4" />,
              onClick: () => router.push('/restaurants?action=add'),
              variant: 'primary',
            },
            {
              label: 'Manage Users',
              icon: <Users className="h-4 w-4" />,
              onClick: () => router.push('/admin?tab=users'),
            },
            {
              label: 'View Reports',
              icon: <TrendingUp className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.reports),
            },
            {
              label: 'System Settings',
              icon: <Server className="h-4 w-4" />,
              onClick: () => router.push('/admin?tab=settings'),
            },
            {
              label: 'Support Tickets',
              icon: <Shield className="h-4 w-4" />,
              onClick: () => router.push('/admin?tab=support'),
            },
            {
              label: 'Billing',
              icon: <DollarSign className="h-4 w-4" />,
              onClick: () => router.push('/admin?tab=billing'),
            },
          ]}
        />
      </DashboardGrid>

      <DashboardSection title="Top Performing Restaurants">
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { name: "Luigi's Kitchen", revenue: 45000, orders: 1250, growth: 23 },
                { name: 'Bella Vista', revenue: 38500, orders: 980, growth: 18 },
                { name: 'The Steakhouse', revenue: 32000, orders: 650, growth: 15 },
                { name: 'Downtown Grill', revenue: 28000, orders: 820, growth: 12 },
                { name: 'Ocean View Cafe', revenue: 24500, orders: 740, growth: 8 },
              ].map((restaurant, index) => (
                <div key={restaurant.name} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{restaurant.name}</p>
                      <p className="text-sm text-muted-foreground">{restaurant.orders.toLocaleString()} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${restaurant.revenue.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1 text-sm text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      {restaurant.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardSection>
    </>
  );
}
