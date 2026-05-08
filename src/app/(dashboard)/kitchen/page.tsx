'use client';

import { DashboardLayout, DashboardHeader, DashboardGrid, DashboardSection } from '@/components/dashboard/dashboard-layout';
import { StatCard, ActivityFeed, AlertWidget } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { 
  Clock, 
  ChefHat, 
  Flame, 
  AlertCircle,
  CheckCircle2,
  Timer,
  UtensilsCrossed,
  Thermometer,
  FlameKindling,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KitchenOrder {
  id: string;
  orderNumber: string;
  table: string;
  items: Array<{
    name: string;
    quantity: number;
    modifiers?: string[];
  }>;
  status: 'pending' | 'preparing' | 'ready';
  priority: 'normal' | 'high' | 'urgent';
  elapsedTime: number;
  estimatedTime: number;
}

const initialOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: 'K-12345',
    table: 'T-12',
    items: [
      { name: 'Grilled Salmon', quantity: 2, modifiers: ['Medium rare', 'No sauce'] },
      { name: 'Truffle Pasta', quantity: 1 },
    ],
    status: 'preparing',
    priority: 'normal',
    elapsedTime: 8,
    estimatedTime: 15,
  },
  {
    id: '2',
    orderNumber: 'K-12346',
    table: 'T-08',
    items: [
      { name: 'Ribeye Steak', quantity: 1, modifiers: ['Medium', 'Extra butter'] },
      { name: 'Caesar Salad', quantity: 1 },
    ],
    status: 'pending',
    priority: 'high',
    elapsedTime: 3,
    estimatedTime: 20,
  },
  {
    id: '3',
    orderNumber: 'K-12347',
    table: 'T-05',
    items: [
      { name: 'Chocolate Lava Cake', quantity: 2 },
    ],
    status: 'ready',
    priority: 'normal',
    elapsedTime: 12,
    estimatedTime: 10,
  },
  {
    id: '4',
    orderNumber: 'K-12348',
    table: 'T-15',
    items: [
      { name: 'Seafood Platter', quantity: 1 },
      { name: 'Mashed Potatoes', quantity: 2 },
    ],
    status: 'preparing',
    priority: 'urgent',
    elapsedTime: 18,
    estimatedTime: 25,
  },
];

const recentActivity = [
  { id: '1', type: 'order' as const, title: 'Order K-12344 marked ready', description: 'Table 3 - Ready for pickup', timestamp: '2 minutes ago', status: 'success' as const },
  { id: '2', type: 'alert' as const, title: 'High priority order received', description: 'K-12348 - Urgent', timestamp: '5 minutes ago', status: 'warning' as const },
  { id: '3', type: 'order' as const, title: 'Order K-12343 completed', description: 'Table 7 - Served', timestamp: '8 minutes ago', status: 'success' as const },
  { id: '4', type: 'inventory' as const, title: 'Low stock alert', description: 'Chicken Breast - 2kg remaining', timestamp: '12 minutes ago', status: 'warning' as const },
];

const alerts = [
  { id: '1', type: 'warning' as const, title: 'High priority order waiting', message: 'Order K-12348 has been waiting 18 minutes', action: { label: 'View Order', onClick: () => {} } },
  { id: '2', type: 'info' as const, title: 'Rush hour approaching', message: 'Expect increased orders from 6-9 PM' },
];

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [currentTime, setCurrentTime] = useState(new Date());

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  const delayedOrders = orders.filter(o => o.elapsedTime > o.estimatedTime).length;

  const getPriorityColor = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Kitchen Display System"
        description="Live order management"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Clock className="mr-1 h-3 w-3" />
              {currentTime.toLocaleTimeString()}
            </Badge>
          </div>
        }
      />

      <AlertWidget alerts={alerts} />

      <DashboardGrid columns={4}>
        <StatCard
          title="Pending"
          value={pendingOrders.toString()}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="Preparing"
          value={preparingOrders.toString()}
          icon={<ChefHat className="h-5 w-5" />}
          variant="info"
        />
        <StatCard
          title="Ready"
          value={readyOrders.toString()}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Delayed"
          value={delayedOrders.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant={delayedOrders > 0 ? 'danger' : 'default'}
        />
      </DashboardGrid>

      <DashboardSection title="Active Orders">
        <DashboardGrid columns={3}>
          {/* Pending Column */}
          <Card className="bg-amber-50/50 border-amber-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Pending ({orders.filter(o => o.status === 'pending').length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {orders.filter(o => o.status === 'pending').map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.table}</p>
                      </div>
                      <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                          {item.modifiers && (
                            <p className="text-xs text-muted-foreground ml-4">
                              {item.modifiers.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-amber-600">
                        <Timer className="mr-1 h-3 w-3" />
                        {order.elapsedTime}m
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Preparing Column */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Flame className="h-4 w-4 text-blue-600" />
                  Preparing ({orders.filter(o => o.status === 'preparing').length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {orders.filter(o => o.status === 'preparing').map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.table}</p>
                      </div>
                      <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={order.elapsedTime > order.estimatedTime ? 'text-red-600 border-red-200' : 'text-blue-600'}>
                        <Timer className="mr-1 h-3 w-3" />
                        {order.elapsedTime}m / {order.estimatedTime}m
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Ready
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Ready Column */}
          <Card className="bg-emerald-50/50 border-emerald-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Ready ({orders.filter(o => o.status === 'ready').length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {orders.filter(o => o.status === 'ready').map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.table}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">Ready</Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-emerald-600">
                        <Timer className="mr-1 h-3 w-3" />
                        Waiting {order.elapsedTime - order.estimatedTime}m
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setOrders(prev => prev.filter(o => o.id !== order.id))}
                      >
                        Complete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </DashboardGrid>
      </DashboardSection>

      <DashboardGrid columns={2}>
        <ActivityFeed activities={recentActivity} maxHeight={300} />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Station Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FlameKindling className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Grill Station</p>
                    <p className="text-sm text-muted-foreground">2 orders active</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cold Prep</p>
                    <p className="text-sm text-muted-foreground">1 order active</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Thermometer className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pastry Station</p>
                    <p className="text-sm text-muted-foreground">3 orders active</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Busy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </DashboardLayout>
  );
}
