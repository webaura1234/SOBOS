'use client';

import { type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
