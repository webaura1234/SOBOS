'use client';

import { PageHeader, DataTable, StatusBadge, SearchInput, FilterBar, FilterItem } from '@/components/common';
import { EmptyState, LoadingSkeleton } from '@/components/feedback';
import { useRestaurants } from '@/hooks/api';
import type { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '@/config/routes';

export default function RestaurantsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useRestaurants({ page, limit: 10, search, filters: { status } });

  if (isLoading) return <LoadingSkeleton type="page" />;

  const restaurants = (data?.data as Restaurant[] | undefined) || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurants"
        description="Manage your restaurant locations"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        }
      />

      <FilterBar>
        <FilterItem label="Search">
          <SearchInput placeholder="Search restaurants..." value={search} onChange={setSearch} className="w-[280px]" />
        </FilterItem>
        <FilterItem label="Status">
          <Select value={status} onValueChange={(v) => setStatus(v || '')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
      </FilterBar>

      {restaurants.length === 0 ? (
        <EmptyState
          title="No restaurants found"
          description="You haven't created any restaurants yet. Add your first restaurant to get started."
          actionLabel="Add Restaurant"
          action={() => {}}
        />
      ) : (
        <DataTable
          data={restaurants}
          columns={[
            {
              key: 'name',
              header: 'Restaurant',
              cell: (item) => (
                <div className="space-y-1">
                  <Link href={ROUTES.protected.restaurantDetail(item.id)} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  )}
                </div>
              ),
            },
            {
              key: 'address',
              header: 'Location',
              cell: (item) => (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.address}
                </div>
              ),
            },
            {
              key: 'phone',
              header: 'Contact',
              cell: (item) => (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {item.phone && <Phone className="h-3.5 w-3.5" />}
                  {item.phone || '—'}
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              cell: (item) => <StatusBadge status={item.status} />,
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
