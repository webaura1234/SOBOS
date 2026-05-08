'use client';

import { PageHeader, DataTable, StatusBadge, SearchInput, FilterBar, FilterItem } from '@/components/common';
import { EmptyState, LoadingSkeleton } from '@/components/feedback';
import { useMenuItems } from '@/hooks/api';
import type { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function MenuPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useMenuItems({ page, limit: 10, search, filters: { category } });

  if (isLoading) return <LoadingSkeleton type="page" />;

  const responseData = data?.data as { items?: MenuItem[]; meta?: unknown } | undefined;
  const items = responseData?.items || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu"
        description="Manage your menu items"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        }
      />

      <FilterBar>
        <FilterItem label="Search">
          <SearchInput placeholder="Search menu..." value={search} onChange={setSearch} className="w-[280px]" />
        </FilterItem>
        <FilterItem label="Category">
          <Select value={category} onValueChange={(v) => setCategory(v || '')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="appetizer">Appetizer</SelectItem>
              <SelectItem value="main">Main Course</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
              <SelectItem value="beverage">Beverage</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
      </FilterBar>

      {items.length === 0 ? (
        <EmptyState
          title="No menu items found"
          description="You haven't added any menu items yet."
          actionLabel="Add Item"
          action={() => {}}
        />
      ) : (
        <DataTable
          data={items}
          columns={[
            {
              key: 'name',
              header: 'Item',
              cell: (item) => (
                <div className="space-y-1">
                  <p className="font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  )}
                </div>
              ),
            },
            {
              key: 'category',
              header: 'Category',
              cell: (item) => <span className="text-sm capitalize">{item.category}</span>,
            },
            {
              key: 'price',
              header: 'Price',
              cell: (item) => <span className="font-medium">${item.price.toFixed(2)}</span>,
            },
            {
              key: 'isAvailable',
              header: 'Available',
              cell: (item) => (
                <StatusBadge status={item.isAvailable ? 'active' : 'inactive'} />
              ),
            },
          ]}
          pagination={
            meta
              ? {
                  page: meta.page,
                  limit: meta.limit,
                  total: meta.total,
                  totalPages: meta.totalPages,
                }
              : undefined
          }
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
