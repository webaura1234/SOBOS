'use client';

import { useState } from 'react';
import { DataTable } from './data-table';
import { Pagination } from './pagination';
import { SearchInput } from '../forms/search-input';
import { FilterBar, FilterItem } from './filter-bar';
import { EmptyState } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableEnhancedProps<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  isLoading?: boolean;
  getRowId?: (item: T) => string;
}

export function DataTableEnhanced<T>({
  data,
  columns,
  total,
  page,
  limit,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search...',
  filters,
  onAdd,
  addLabel = 'Add New',
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items to display.',
  isLoading,
  getRowId,
}: DataTableEnhancedProps<T>) {
  const [showFilters, setShowFilters] = useState(false);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {onSearch && (
          <SearchInput
            placeholder={searchPlaceholder}
            onChange={onSearch}
            className="sm:max-w-sm"
          />
        )}
        <div className="flex items-center gap-2 ml-auto">
          {filters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-9"
            >
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
              Filters
            </Button>
          )}
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="h-9">
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {showFilters && filters && (
        <FilterBar>{filters}</FilterBar>
      )}

      {data.length === 0 && !isLoading ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={onAdd ? () => onAdd() : undefined}
          actionLabel={onAdd ? addLabel : undefined}
        />
      ) : (
        <>
          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            getRowId={getRowId}
          />
          {totalPages > 1 && (
            <Pagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
