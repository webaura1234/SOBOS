'use client';

import {
  DashboardLayout,
  DashboardHeader,
  DashboardGrid,
  DashboardSection,
} from '@/components/dashboard/dashboard-layout';
import { StatCard, AlertWidget, ActivityFeed, ChartWidget } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  RotateCcw,
  X,
  UtensilsCrossed,
  CreditCard,
  MapPin,
  User,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DEMO_ITEMS } from '../menu/page';

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
  {
    id: '1',
    orderNumber: 'ORD-2024-0156',
    type: 'dine-in',
    table: 'T-12',
    customer: 'John Smith',
    items: 4,
    total: 156.5,
    status: 'served',
    paymentStatus: 'paid',
    time: '12:30 PM',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0157',
    type: 'delivery',
    customer: 'Sarah Johnson',
    items: 3,
    total: 89.0,
    status: 'preparing',
    paymentStatus: 'paid',
    time: '12:45 PM',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-0158',
    type: 'dine-in',
    table: 'T-08',
    customer: 'Mike Davis',
    items: 2,
    total: 67.5,
    status: 'ready',
    paymentStatus: 'pending',
    time: '1:00 PM',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-0159',
    type: 'takeaway',
    customer: 'Emma Wilson',
    items: 5,
    total: 124.0,
    status: 'confirmed',
    paymentStatus: 'paid',
    time: '1:15 PM',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-0160',
    type: 'dine-in',
    table: 'T-15',
    customer: 'Chris Brown',
    items: 6,
    total: 234.0,
    status: 'preparing',
    paymentStatus: 'pending',
    time: '1:30 PM',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-0161',
    type: 'delivery',
    customer: 'Lisa Anderson',
    items: 3,
    total: 98.5,
    status: 'pending',
    paymentStatus: 'pending',
    time: '1:45 PM',
  },
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
  {
    id: '1',
    type: 'order' as const,
    title: 'Order ORD-2024-0156 served',
    description: 'Table 12 - $156.50',
    timestamp: '2 minutes ago',
    status: 'success' as const,
  },
  {
    id: '2',
    type: 'payment' as const,
    title: 'Payment received',
    description: 'Order ORD-2024-0157 - $89.00',
    timestamp: '5 minutes ago',
    status: 'success' as const,
  },
  {
    id: '3',
    type: 'order' as const,
    title: 'New order received',
    description: 'ORD-2024-0161 - Delivery',
    timestamp: '8 minutes ago',
    status: 'info' as const,
  },
  {
    id: '4',
    type: 'order' as const,
    title: 'Order cancelled',
    description: 'ORD-2024-0155 - Customer request',
    timestamp: '15 minutes ago',
    status: 'warning' as const,
  },
];

const alerts = [
  {
    id: '1',
    type: 'warning' as const,
    title: '3 orders delayed',
    message: 'Orders waiting over 30 minutes',
    action: { label: 'View', onClick: () => {} },
  },
];

/* ─────────────── New Order Panel ─────────────── */
function NewOrderPanel({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [table, setTable] = useState('');
  const [customer, setCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [cartItems, setCartItems] = useState<((typeof DEMO_ITEMS)[0] & { qty: number })[]>([]);
  const [showItemPicker, setShowItemPicker] = useState(false);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] bg-white shadow-2xl flex flex-col border-l">
      {/* header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="font-bold text-lg">New Order</h2>
          <p className="text-xs text-muted-foreground">Fill in the details to create an order</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Order type */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Order Type</label>
          <div className="flex gap-2">
            {(['dine-in', 'takeaway', 'delivery'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all capitalize ${type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table (dine-in only) */}
        {type === 'dine-in' && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">
              Table Number
            </label>
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="e.g. T-05"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        )}

        {/* Customer */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Customer Name</label>
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer name"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Items */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Order Items</label>
          <div className="space-y-2">
            {cartItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCartItems((c) =>
                        c.map((ci, idx) => (idx === i ? { ...ci, qty: Math.max(1, ci.qty - 1) } : ci))
                      )
                    }
                    className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() =>
                      setCartItems((c) => c.map((ci, idx) => (idx === i ? { ...ci, qty: ci.qty + 1 } : ci)))
                    }
                    className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setCartItems((c) => c.filter((_, idx) => idx !== i))}
                    className="ml-1 text-red-400 hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {showItemPicker ? (
              <div className="border rounded-lg p-2 space-y-1">
                <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Item</span>
                  <button onClick={() => setShowItemPicker(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {DEMO_ITEMS.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCartItems((c) => {
                          const existing = c.find((ci) => ci.name === item.name);
                          if (existing) return c.map((ci) => (ci.name === item.name ? { ...ci, qty: ci.qty + 1 } : ci));
                          return [...c, { ...item, qty: 1 }];
                        });
                        setShowItemPicker(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex justify-between items-center transition-colors"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowItemPicker(true)}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </button>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Special instructions..."
            className="w-full border rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* footer */}
      <div className="border-t px-6 py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{cartItems.reduce((s, i) => s + i.qty, 0)} items</span>
          <span className="font-bold text-base">${cartItems.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}</span>
        </div>
        <Button className="w-full" onClick={onClose}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Place Order
        </Button>
      </div>
    </div>
  );
}

/* ─────────────── Order Detail Panel ─────────────── */
function OrderDetailPanel({ order, onClose }: { order: Order; onClose: () => void }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-amber-100 text-amber-800',
    ready: 'bg-purple-100 text-purple-800',
    served: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] bg-white shadow-2xl flex flex-col border-l">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="font-bold text-lg">{order.orderNumber}</h2>
          <p className="text-xs text-muted-foreground">Order Details</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Status row */}
        <div className="flex items-center gap-3">
          <Badge className={statusColors[order.status]}>{order.status}</Badge>
          <Badge variant="outline" className={order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}>
            {order.paymentStatus}
          </Badge>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Customer</span>
            </div>
            <p className="text-sm font-semibold">{order.customer}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <UtensilsCrossed className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Type</span>
            </div>
            <p className="text-sm font-semibold capitalize">
              {order.type}
              {order.table ? ` · ${order.table}` : ''}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Time</span>
            </div>
            <p className="text-sm font-semibold">{order.time}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-sm font-semibold">${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Items ({order.items})</h3>
          <div className="space-y-2">
            {DEMO_ITEMS.slice(0, order.items).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-xs font-bold flex items-center justify-center text-primary">
                    1
                  </span>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtotal */}
        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${(order.total * 0.85).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (15%)</span>
            <span>${(order.total * 0.15).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-2">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button className="flex-1" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

export default function OrdersDashboardPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query params to control panels
  const showNew = searchParams.get('new') === 'true';
  const viewOrderId = searchParams.get('order');
  const viewOrder = viewOrderId ? orders.find((o) => o.id === viewOrderId) : null;

  const closePanel = () => router.replace('/orders');

  const filteredOrders = selectedTab === 'all' ? orders : orders.filter((o) => o.status === selectedTab);

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
    delivery: Truck,
    takeaway: Package,
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
        title="Bella Vista Restaurant"
        description="Owner Dashboard - Today's overview"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedTab('pending')}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" onClick={() => router.push('/orders?new=true')}>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        }
      />

      <AlertWidget
        alerts={alerts.map((alert) => ({
          ...alert,
          action: { label: 'View', onClick: () => setSelectedTab('pending') },
        }))}
      />

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
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="preparing" className="text-xs">
                    Preparing
                  </TabsTrigger>
                  <TabsTrigger value="ready" className="text-xs">
                    Ready
                  </TabsTrigger>
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
                              <Badge variant="outline" className="text-xs">
                                {order.table}
                              </Badge>
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
                          <Badge className={statusColors[order.status]}>{order.status}</Badge>
                          <Badge className={paymentColors[order.paymentStatus]} variant="outline">
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/orders?order=${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.print()}>
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
            <CardDescription>Today&apos;s orders and revenue by hour</CardDescription>
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

      {/* ── Slide-over panels ── */}
      <AnimatePresence>
        {(showNew || viewOrder) && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={closePanel}
            />
            {/* New Order panel */}
            {showNew && (
              <motion.div
                key="new-order"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-50"
              >
                <NewOrderPanel onClose={closePanel} />
              </motion.div>
            )}
            {/* Order detail panel */}
            {viewOrder && (
              <motion.div
                key="order-detail"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-50"
              >
                <OrderDetailPanel order={viewOrder} onClose={closePanel} />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
