'use client';

import { DashboardLayout, DashboardHeader, DashboardGrid, DashboardSection } from '@/components/dashboard/dashboard-layout';
import { StatCard, AlertWidget, ActivityFeed, ChartWidget } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  XCircle,
  ChefHat,
  Truck,
  Package,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Printer,
  RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface Order {
  id: string;
  orderNumber: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  table?: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  time: string;
}

const orders: Order[] = [
  { id: '1', orderNumber: 'ORD-2024-0156', type: 'dine-in', table: 'T-12', customer: 'John Smith', items: 4, total: 156.50, status: 'served', paymentStatus: 'paid', time: '12:30 PM' },
  { id: '2', orderNumber: 'ORD-2024-0157', type: 'delivery', customer: 'Sarah Johnson', items: 3, total: 89.00, status: 'preparing', paymentStatus: 'paid', time: '12:45 PM' },
  { id: '3', orderNumber: 'ORD-2024-0158', type: 'dine-in', table: 'T-08', customer: 'Mike Davis', items: 2, total: 67.50, status: 'ready', paymentStatus: 'pending', time: '1:00 PM' },
  { id: '4', orderNumber: 'ORD-2024-0159', type: 'takeaway', customer: 'Emma Wilson', items: 5, total: 124.00, status: 'confirmed', paymentStatus: 'paid', time: '1:15 PM' },
  { id: '5', orderNumber: 'ORD-2024-0160', type: 'dine-in', table: 'T-15', customer: 'Chris Brown', items: 6, total: 234.00, status: 'preparing', paymentStatus: 'pending', time: '1:30 PM' },
  { id: '6', orderNumber: 'ORD-2024-0161', type: 'delivery', customer: 'Lisa Anderson', items: 3, total: 98.50, status: 'pending', paymentStatus: 'pending', time: '1:45 PM' },
];

const hourlyOrders = [
  { hour: '11AM', orders: 12, revenue: 850 },
  { hour: '12PM', orders: 28, revenue: 2450 },
  { hour: '1PM', orders: 35, revenue: 3120 },
  { hour: '2PM', orders: 22, revenue: 1890 },
  { hour: '3PM', orders: 15, revenue: 1200 },
  { hour: '4PM', orders: 12, revenue: 980 },
  { hour: '5PM', orders: 18, revenue: 1560 },
  { hour: '6PM', orders: 32, revenue: 2890 },
];

const orderTypeData = [
  { name: 'Dine-in', value: 45, color: '#3b82f6' },
  { name: 'Delivery', value: 35, color: '#8b5cf6' },
  { name: 'Takeaway', value: 20, color: '#f59e0b' },
];

const recentActivity = [
  { id: '1', type: 'order' as const, title: 'Order ORD-2024-0156 served', description: 'Table 12 - $156.50', timestamp: '2 minutes ago', status: 'success' as const },
  { id: '2', type: 'payment' as const, title: 'Payment received', description: 'Order ORD-2024-0157 - $89.00', timestamp: '5 minutes ago', status: 'success' as const },
  { id: '3', type: 'order' as const, title: 'New order received', description: 'ORD-2024-0161 - Delivery', timestamp: '8 minutes ago', status: 'info' as const },
  { id: '4', type: 'order' as const, title: 'Order cancelled', description: 'ORD-2024-0155 - Customer request', timestamp: '15 minutes ago', status: 'warning' as const },
];

const alerts = [
  { id: '1', type: 'warning' as const, title: '3 orders delayed', message: 'Orders waiting over 30 minutes', action: { label: 'View', onClick: () => {} } },
];

export default function OrdersDashboardPage() {
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === selectedTab);

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-amber-100 text-amber-800',
    ready: 'bg-purple-100 text-purple-800',
    served: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    paid: 'bg-emerald-100 text-emerald-800',
    refunded: 'bg-red-100 text-red-800',
  };

  const typeIcons = {
    'dine-in': ChefHat,
    'delivery': Truck,
    'takeaway': Package,
  };

  const stats = {
    totalOrders: 142,
    totalRevenue: 4850,
    avgOrderValue: 34.15,
    pendingOrders: 8,
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Orders Management"
        description="Track and manage all orders"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
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
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: 12.5, label: 'vs yesterday' }}
          variant="info"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 8.3, label: 'vs yesterday' }}
          variant="success"
        />
        <StatCard
          title="Avg Order Value"
          value={`$${stats.avgOrderValue}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 5.2, label: 'vs last week' }}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
      </DashboardGrid>

      <DashboardGrid columns={3}>
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Orders Overview</CardTitle>
                <CardDescription>Manage and track all orders</CardDescription>
              </div>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                  <TabsTrigger value="preparing" className="text-xs">Preparing</TabsTrigger>
                  <TabsTrigger value="ready" className="text-xs">Ready</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <AnimatePresence>
                {filteredOrders.map((order) => {
                  const TypeIcon = typeIcons[order.type];
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{order.orderNumber}</p>
                            {order.table && (
                              <Badge variant="outline" className="text-xs">{order.table}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.customer} • {order.items} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{order.time}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                          <Badge className={paymentColors[order.paymentStatus]} variant="outline">
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {orderTypeData.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <span className="text-sm font-medium">{type.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ActivityFeed activities={recentActivity} maxHeight={250} />
        </div>
      </DashboardGrid>

      <DashboardSection title="Revenue Trends">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hourly Revenue</CardTitle>
            <CardDescription>Today's orders and revenue by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                <YAxis yAxisId="left" stroke="#888" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </DashboardSection>
    </DashboardLayout>
  );
}
