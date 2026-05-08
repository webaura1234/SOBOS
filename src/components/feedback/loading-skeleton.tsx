import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type?: 'page' | 'card' | 'table' | 'form' | 'chart';
  count?: number;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  );
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return <Skeleton className="h-[350px] w-full rounded-lg" />;
}

export function LoadingSkeleton({ type = 'page', count }: LoadingSkeletonProps) {
  switch (type) {
    case 'page':
      return <PageSkeleton />;
    case 'card':
      return <CardSkeleton count={count} />;
    case 'table':
      return <TableSkeleton />;
    case 'form':
      return <FormSkeleton />;
    case 'chart':
      return <ChartSkeleton />;
    default:
      return <PageSkeleton />;
  }
}
