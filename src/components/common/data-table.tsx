'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { EmptyState } from '@/components/feedback';

interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (id: string) => void;
  getRowId?: (item: T) => string;
  isLoading?: boolean;
  emptyState?: { title: string; description?: string };
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  selectable,
  selectedRows = [],
  onRowSelect,
  getRowId = (item: T) => (item as Record<string, unknown>).id as string,
  isLoading,
  emptyState,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox aria-label="Select all rows" />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="p-0">
                  {emptyState ? (
                    <EmptyState title={emptyState.title} description={emptyState.description} />
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">No data available</div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={getRowId(item)} data-state={selectedRows.includes(getRowId(item)) ? 'selected' : undefined}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(getRowId(item))}
                        onCheckedChange={() => onRowSelect?.(getRowId(item))}
                        aria-label={`Select row ${getRowId(item)}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handlePageChange(pagination.totalPages)} disabled={currentPage === pagination.totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
