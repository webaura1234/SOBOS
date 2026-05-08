'use client';

import {
  DashboardGrid,
  DashboardSection,
  DashboardHeader,
} from '@/components/dashboard/dashboard-layout';
import { StatCard, ActivityFeed, QuickActions } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import {
  Clock,
  DollarSign,
  ShoppingBag,
  Users,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Plus,
  Calendar,
  Star,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const staffStats = {
  ordersServed: 47,
  tipsEarned: 128.5,
  hoursWorked: 6.5,
  rating: 4.9,
};

const performanceData = [
  { day: 'Mon', orders: 42 },
  { day: 'Tue', orders: 38 },
  { day: 'Wed', orders: 45 },
  { day: 'Thu', orders: 50 },
  { day: 'Fri', orders: 55 },
  { day: 'Sat', orders: 62 },
  { day: 'Sun', orders: 58 },
];

const recentActivity = [
  {
    id: '1',
    type: 'order' as const,
    title: 'Order #12345 served',
    description: 'Table 12 - $156.50',
    timestamp: '5 minutes ago',
    status: 'success' as const,
  },
  {
    id: '2',
    type: 'payment' as const,
    title: 'Tip received',
    description: '$15.00 from Table 8',
    timestamp: '12 minutes ago',
    status: 'success' as const,
  },
  {
    id: '3',
    type: 'order' as const,
    title: 'Order #12344 completed',
    description: 'Table 5 - $89.00',
    timestamp: '18 minutes ago',
    status: 'success' as const,
  },
  {
    id: '4',
    type: 'staff' as const,
    title: 'Break ended',
    description: '15-minute break completed',
    timestamp: '30 minutes ago',
    status: 'info' as const,
  },
];

const activeTables = [
  { table: 'T-01', guests: 4, status: 'dining', time: '45 min', total: 245.0 },
  { table: 'T-03', guests: 2, status: 'ordering', time: '10 min', total: 0 },
  { table: 'T-05', guests: 6, status: 'dining', time: '30 min', total: 380.0 },
  { table: 'T-08', guests: 2, status: 'payment', time: '65 min', total: 156.5 },
  { table: 'T-12', guests: 4, status: 'dining', time: '20 min', total: 189.0 },
];

const statusColors: Record<string, string> = {
  dining: 'bg-blue-100 text-blue-800',
  ordering: 'bg-amber-100 text-amber-800',
  payment: 'bg-emerald-100 text-emerald-800',
};

export default function StaffDashboardPage() {
  const [clockedIn, setClockedIn] = useState(true);
  const router = useRouter();

  return (
    <>
      <DashboardHeader
        title="Staff Dashboard"
        description="Welcome back, Sarah"
        actions={
          <Button variant={clockedIn ? 'destructive' : 'default'} onClick={() => setClockedIn(!clockedIn)}>
            <Clock className="mr-2 h-4 w-4" />
            {clockedIn ? 'Clock Out' : 'Clock In'}
          </Button>
        }
      />

      <DashboardGrid columns={4}>
        <StatCard
          title="Orders Served"
          value={staffStats.ordersServed.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: 15, label: 'vs yesterday' }}
          variant="success"
        />
        <StatCard
          title="Tips Earned"
          value={`$${staffStats.tipsEarned.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 22, label: 'vs yesterday' }}
          variant="success"
        />
        <StatCard
          title="Hours Worked"
          value={`${staffStats.hoursWorked}h`}
          icon={<Clock className="h-5 w-5" />}
          subtitle="Today"
        />
        <StatCard
          title="Performance"
          value={staffStats.rating.toString()}
          icon={<Star className="h-5 w-5" />}
          subtitle="Customer rating"
          variant="success"
        />
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Performance</CardTitle>
              <Badge variant="outline">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Active Tables</CardTitle>
              <Badge>{activeTables.length} tables</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {activeTables.map((table) => (
                <div key={table.table} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-medium">
                      {table.table}
                    </div>
                    <div>
                      <p className="font-medium">{table.guests} guests</p>
                      <p className="text-xs text-muted-foreground">{table.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColors[table.status]}>
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </Badge>
                    {table.total > 0 && <p className="text-sm font-medium mt-1">${table.total.toFixed(2)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <ActivityFeed activities={recentActivity} maxHeight={300} />

        <QuickActions
          actions={[
            {
              label: 'New Order',
              icon: <Plus className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.orders),
              variant: 'primary',
            },
            {
              label: 'My Schedule',
              icon: <Calendar className="h-4 w-4" />,
              onClick: () => router.push(`${ROUTES.protected.staff}?tab=schedule`),
            },
            {
              label: 'Menu Items',
              icon: <UtensilsCrossed className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.protected.menu),
            },
            {
              label: 'Request Help',
              icon: <AlertCircle className="h-4 w-4" />,
              onClick: () => router.push(`${ROUTES.protected.staff}?tab=support`),
            },
          ]}
        />
      </DashboardGrid>

      <DashboardSection title="Shift Summary">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">47</p>
                <p className="text-sm text-muted-foreground">Orders Served</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">$128.50</p>
                <p className="text-sm text-muted-foreground">Tips Earned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">$2,450</p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardSection>
    </>
  );
}
