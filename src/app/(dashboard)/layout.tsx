'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AuthGuard } from '@/components/guards';
import { GlobalSearch } from '@/components/search/global-search';
import { PageSkeleton } from '@/components/feedback';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AuthGuard>
        <DashboardLayout>
          <GlobalSearch />
          {children}
        </DashboardLayout>
      </AuthGuard>
    </Suspense>
  );
}
