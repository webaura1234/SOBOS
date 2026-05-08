'use client';

import {
  DashboardGrid,
  DashboardSection,
  DashboardHeader,
} from '@/components/dashboard/dashboard-layout';
import { StatCard, ActivityFeed, AlertWidget } from '@/components/dashboard/dashboard-widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table2,
  Users,
  Clock,
  DollarSign,
  Plus,
  MoreHorizontal,
  UtensilsCrossed,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
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

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentGuests?: number;
  orderTotal?: number;
  elapsedTime?: string;
  server?: string;
}

const tables: Table[] = [
  {
    id: '1',
    number: 'T-01',
    capacity: 4,
    status: 'occupied',
    currentGuests: 4,
    orderTotal: 245.0,
    elapsedTime: '45 min',
    server: 'Sarah',
  },
  { id: '2', number: 'T-02', capacity: 2, status: 'available' },
  {
    id: '3',
    number: 'T-03',
    capacity: 6,
    status: 'occupied',
    currentGuests: 5,
    orderTotal: 380.0,
    elapsedTime: '30 min',
    server: 'Mike',
  },
  { id: '4', number: 'T-04', capacity: 2, status: 'reserved' },
  {
    id: '5',
    number: 'T-05',
    capacity: 4,
    status: 'occupied',
    currentGuests: 3,
    orderTotal: 156.5,
    elapsedTime: '20 min',
    server: 'Sarah',
  },
  {
    id: '6',
    number: 'T-06',
    capacity: 8,
    status: 'occupied',
    currentGuests: 7,
    orderTotal: 520.0,
    elapsedTime: '55 min',
    server: 'John',
  },
  { id: '7', number: 'T-07', capacity: 2, status: 'cleaning' },
  {
    id: '8',
    number: 'T-08',
    capacity: 4,
    status: 'occupied',
    currentGuests: 2,
    orderTotal: 89.0,
    elapsedTime: '10 min',
    server: 'Mike',
  },
  { id: '9', number: 'T-09', capacity: 6, status: 'available' },
  { id: '10', number: 'T-10', capacity: 4, status: 'reserved' },
  { id: '11', number: 'T-11', capacity: 2, status: 'available' },
  {
    id: '12',
    number: 'T-12',
    capacity: 4,
    status: 'occupied',
    currentGuests: 4,
    orderTotal: 178.0,
    elapsedTime: '35 min',
    server: 'Sarah',
  },
];

const hourlyOccupancy = [
  { hour: '11AM', occupied: 8, available: 4 },
  { hour: '12PM', occupied: 10, available: 2 },
  { hour: '1PM', occupied: 12, available: 0 },
  { hour: '2PM', occupied: 11, available: 1 },
  { hour: '3PM', occupied: 7, available: 5 },
  { hour: '4PM', occupied: 6, available: 6 },
  { hour: '5PM', occupied: 8, available: 4 },
  { hour: '6PM', occupied: 12, available: 0 },
];

const statusDistribution = [
  { name: 'Occupied', value: 6, color: '#ef4444' },
  { name: 'Available', value: 4, color: '#22c55e' },
  { name: 'Reserved', value: 2, color: '#3b82f6' },
];

const recentActivity = [
  {
    id: '1',
    type: 'order' as const,
    title: 'Table T-01 check requested',
    description: 'Bill ready for payment',
    timestamp: '2 minutes ago',
    status: 'info' as const,
  },
  {
    id: '2',
    type: 'staff' as const,
    title: 'Table T-07 cleaned',
    description: 'Ready for next guests',
    timestamp: '5 minutes ago',
    status: 'success' as const,
  },
  {
    id: '3',
    type: 'order' as const,
    title: 'New guests seated',
    description: 'Table T-05 - Party of 3',
    timestamp: '10 minutes ago',
    status: 'info' as const,
  },
  {
    id: '4',
    type: 'alert' as const,
    title: 'Table T-06 waiting long',
    description: '45 minutes elapsed',
    timestamp: '15 minutes ago',
    status: 'warning' as const,
  },
];

const alerts = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'High occupancy rate',
    message: '90% of tables currently occupied',
    action: { label: 'View Floor Plan', onClick: () => {} },
  },
];

export default function TablesDashboardPage() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const router = useRouter();

  const availableTables = tables.filter((t) => t.status === 'available').length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const totalGuests = tables.filter((t) => t.status === 'occupied').reduce((acc, t) => acc + (t.currentGuests || 0), 0);
  const avgTurnTime = '52 min';

  const statusColors: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    occupied: 'bg-red-100 text-red-800 border-red-200',
    reserved: 'bg-blue-100 text-blue-800 border-blue-200',
    cleaning: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <>
      <DashboardHeader
        title="Table Management"
        description="Monitor and manage restaurant floor"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => router.push('/tables?action=add')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </div>
        }
      />

      <AlertWidget
        alerts={alerts.map((alert) => ({
          ...alert,
          action: { label: 'View Floor Plan', onClick: () => setSelectedTable(tables[0]) },
        }))}
      />

      <DashboardGrid columns={4}>
        <StatCard title="Total Tables" value={tables.length.toString()} icon={<Table2 className="h-5 w-5" />} />
        <StatCard
          title="Available"
          value={availableTables.toString()}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Occupied"
          value={occupiedTables.toString()}
          icon={<Users className="h-5 w-5" />}
          variant={occupiedTables > 8 ? 'warning' : 'default'}
        />
        <StatCard
          title="Total Guests"
          value={totalGuests.toString()}
          icon={<Users className="h-5 w-5" />}
          subtitle={`Avg turn: ${avgTurnTime}`}
        />
      </DashboardGrid>

      <DashboardGrid columns={3}>
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Floor Plan</CardTitle>
                  <CardDescription>Live table status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800">Available</Badge>
                  <Badge className="bg-red-100 text-red-800">Occupied</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Reserved</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                <AnimatePresence>
                  {tables.map((table) => (
                    <motion.div
                      key={table.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTable(table)}
                      className={`
                        cursor-pointer rounded-lg border-2 p-4 transition-all
                        ${statusColors[table.status]}
                        ${selectedTable?.id === table.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-lg">{table.number}</p>
                          <p className="text-xs opacity-80">{table.capacity} seats</p>
                        </div>
                        <div className="text-right">
                          {table.status === 'occupied' && table.currentGuests && (
                            <p className="font-semibold">{table.currentGuests}</p>
                          )}
                        </div>
                      </div>
                      {table.status === 'occupied' && (
                        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                          <p className="text-xs font-medium">${table.orderTotal?.toFixed(2)}</p>
                          <p className="text-xs opacity-80">{table.elapsedTime}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedTable ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{selectedTable.number} Details</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedTable(null)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={statusColors[selectedTable.status]}>
                    {selectedTable.status.charAt(0).toUpperCase() + selectedTable.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-medium">{selectedTable.capacity} guests</span>
                </div>
                {selectedTable.status === 'occupied' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Guests</span>
                      <span className="font-medium">{selectedTable.currentGuests}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Order Total</span>
                      <span className="font-medium">${selectedTable.orderTotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time Seated</span>
                      <span className="font-medium">{selectedTable.elapsedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Server</span>
                      <span className="font-medium">{selectedTable.server}</span>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => router.push(`/orders?table=${selectedTable.number}`)}
                      >
                        <UtensilsCrossed className="mr-2 h-4 w-4" />
                        Add Order
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        onClick={() => router.push(`/orders?table=${selectedTable.number}&action=payment`)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Process Payment
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select a Table</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Click on a table to view details and take actions
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Occupancy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={hourlyOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="occupied" fill="#ef4444" radius={[2, 2, 0, 0]} name="Occupied" />
                  <Bar dataKey="available" fill="#22c55e" radius={[2, 2, 0, 0]} name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <ActivityFeed activities={recentActivity} maxHeight={200} />
        </div>
      </DashboardGrid>
    </>
  );
}
