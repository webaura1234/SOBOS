'use client';

import { DashboardLayout, DashboardHeader, DashboardGrid, DashboardSection, DashboardCard } from '@/components/dashboard/dashboard-layout';
import { StatCard, AlertWidget, ActivityFeed } from '@/components/dashboard/dashboard-widgets';
import { DataTable, BulkAction } from '@/components/tables/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign,
  Plus,
  ArrowUpDown,
  ShoppingCart,
  Truck,
  Warehouse,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  History
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  supplier: string;
  lastOrdered: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const inventoryData: InventoryItem[] = [
  { id: '1', name: 'Chicken Breast', category: 'Meat', quantity: 25, unit: 'kg', minStock: 20, maxStock: 100, unitCost: 8.50, totalValue: 212.50, supplier: 'Premium Meats Co.', lastOrdered: '2 days ago', status: 'in-stock' },
  { id: '2', name: 'Atlantic Salmon', category: 'Seafood', quantity: 12, unit: 'kg', minStock: 15, maxStock: 50, unitCost: 18.00, totalValue: 216.00, supplier: 'Ocean Fresh', lastOrdered: '1 day ago', status: 'low-stock' },
  { id: '3', name: 'Ribeye Steak', category: 'Meat', quantity: 45, unit: 'kg', minStock: 25, maxStock: 80, unitCost: 22.00, totalValue: 990.00, supplier: 'Premium Meats Co.', lastOrdered: '3 days ago', status: 'in-stock' },
  { id: '4', name: 'Olive Oil (Extra Virgin)', category: 'Pantry', quantity: 8, unit: 'bottles', minStock: 12, maxStock: 50, unitCost: 15.00, totalValue: 120.00, supplier: 'Mediterranean Imports', lastOrdered: '5 days ago', status: 'low-stock' },
  { id: '5', name: 'Fresh Basil', category: 'Produce', quantity: 2, unit: 'bunches', minStock: 5, maxStock: 20, unitCost: 3.50, totalValue: 7.00, supplier: 'Green Farms', lastOrdered: '1 day ago', status: 'out-of-stock' },
  { id: '6', name: 'Truffle Oil', category: 'Pantry', quantity: 15, unit: 'bottles', minStock: 5, maxStock: 30, unitCost: 45.00, totalValue: 675.00, supplier: 'Gourmet Imports', lastOrdered: '1 week ago', status: 'in-stock' },
  { id: '7', name: 'Arborio Rice', category: 'Pantry', quantity: 60, unit: 'kg', minStock: 30, maxStock: 150, unitCost: 4.50, totalValue: 270.00, supplier: 'Italian Imports', lastOrdered: '4 days ago', status: 'in-stock' },
  { id: '8', name: 'Heavy Cream', category: 'Dairy', quantity: 10, unit: 'liters', minStock: 20, maxStock: 100, unitCost: 6.00, totalValue: 60.00, supplier: 'Local Dairy Farm', lastOrdered: '1 day ago', status: 'low-stock' },
];

const alerts = [
  { id: '1', type: 'error' as const, title: 'Fresh Basil is out of stock', message: 'Immediate reorder required for menu items', action: { label: 'Order Now', onClick: () => {} } },
  { id: '2', type: 'warning' as const, title: '3 items below minimum stock', message: 'Atlantic Salmon, Olive Oil, Heavy Cream', action: { label: 'Review', onClick: () => {} } },
];

const recentActivity = [
  { id: '1', type: 'inventory' as const, title: 'Stock updated', description: 'Chicken Breast +50kg received', timestamp: '10 minutes ago', status: 'success' as const },
  { id: '2', type: 'alert' as const, title: 'Low stock alert', description: 'Fresh Basil below minimum', timestamp: '30 minutes ago', status: 'warning' as const },
  { id: '3', type: 'inventory' as const, title: 'Purchase order created', description: 'PO-2024-0154 for $1,240', timestamp: '1 hour ago', status: 'info' as const },
  { id: '4', type: 'inventory' as const, title: 'Waste logged', description: '3kg chicken breast expired', timestamp: '2 hours ago', status: 'warning' as const },
];

const categoryDistribution = [
  { category: 'Meat', value: 35, color: '#ef4444' },
  { category: 'Produce', value: 25, color: '#22c55e' },
  { category: 'Pantry', value: 20, color: '#f59e0b' },
  { category: 'Dairy', value: 12, color: '#3b82f6' },
  { category: 'Seafood', value: 8, color: '#8b5cf6' },
];

export default function InventoryDashboardPage() {
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);

  const lowStockCount = inventoryData.filter(i => i.status === 'low-stock').length;
  const outOfStockCount = inventoryData.filter(i => i.status === 'out-of-stock').length;
  const totalValue = inventoryData.reduce((acc, item) => acc + item.totalValue, 0);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: 'name',
      header: 'Item Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.category}</p>
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Stock Level',
      cell: ({ row }) => {
        const item = row.original;
        const percentage = (item.quantity / item.maxStock) * 100;
        return (
          <div className="w-32">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>{item.quantity} {item.unit}</span>
              <span className={percentage < 25 ? 'text-red-600' : 'text-muted-foreground'}>
                {percentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusConfig = {
          'in-stock': { label: 'In Stock', className: 'bg-emerald-100 text-emerald-800' },
          'low-stock': { label: 'Low Stock', className: 'bg-amber-100 text-amber-800' },
          'out-of-stock': { label: 'Out of Stock', className: 'bg-red-100 text-red-800' },
        };
        return <Badge className={statusConfig[status].className}>{statusConfig[status].label}</Badge>;
      },
    },
    {
      accessorKey: 'unitCost',
      header: 'Unit Cost',
      cell: ({ row }) => <span>${row.original.unitCost.toFixed(2)}</span>,
    },
    {
      accessorKey: 'totalValue',
      header: 'Total Value',
      cell: ({ row }) => <span className="font-medium">${row.original.totalValue.toFixed(2)}</span>,
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
    },
    {
      accessorKey: 'lastOrdered',
      header: 'Last Ordered',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const bulkActions: BulkAction<InventoryItem>[] = [
    {
      label: 'Create Purchase Order',
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      onClick: (items) => console.log('Creating PO for', items),
    },
    {
      label: 'Adjust Stock',
      icon: <ArrowUpDown className="mr-2 h-4 w-4" />,
      onClick: (items) => console.log('Adjusting stock for', items),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Inventory Management"
        description="Track stock levels and manage supplies"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        }
      />

      <AlertWidget alerts={alerts} />

      <DashboardGrid columns={4}>
        <StatCard
          title="Total Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 5.2, label: 'vs last week' }}
          variant="info"
        />
        <StatCard
          title="Items In Stock"
          value={inventoryData.filter(i => i.status === 'in-stock').length.toString()}
          icon={<Package className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: -2, label: 'vs yesterday' }}
          variant="warning"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount.toString()}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="danger"
        />
      </DashboardGrid>

      <DashboardGrid columns={3}>
        <DashboardCard 
          title="Stock Overview" 
          description="Inventory by category"
          className="col-span-2"
        >
          <DataTable
            data={inventoryData}
            columns={columns}
            enableRowSelection
            onSelectionChange={setSelectedItems}
            bulkActions={bulkActions}
            searchPlaceholder="Search inventory..."
            pageSize={5}
          />
        </DashboardCard>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryDistribution.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${cat.value}%`, backgroundColor: cat.color }} 
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{cat.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  New PO
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Receive
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Warehouse className="mr-2 h-4 w-4" />
                  Transfer
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Log Waste
                </Button>
              </div>
            </CardContent>
          </Card>

          <ActivityFeed activities={recentActivity} maxHeight={200} />
        </div>
      </DashboardGrid>
    </DashboardLayout>
  );
}
