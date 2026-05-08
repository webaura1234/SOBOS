'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { useMediaQuery } from '@/hooks';
import { ROUTES } from '@/config/routes';
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  ChefHat,
  Package,
  Table2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const mainNav = [
  { label: 'Dashboard', href: ROUTES.protected.dashboard, icon: LayoutDashboard },
  { label: 'Restaurants', href: ROUTES.protected.restaurants, icon: Store },
  { label: 'Orders', href: ROUTES.protected.orders, icon: ShoppingCart },
  { label: 'Menu', href: ROUTES.protected.menu, icon: UtensilsCrossed },
  { label: 'Staff', href: ROUTES.protected.staff, icon: Users },
  { label: 'Kitchen', href: '/kitchen', icon: ChefHat },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Tables', href: '/tables', icon: Table2 },
  { label: 'Reports', href: ROUTES.protected.reports, icon: BarChart3 },
  { label: 'Settings', href: ROUTES.protected.settings, icon: Settings },
];

// Admin navigation items
const adminNav = [{ label: 'Platform Admin', href: '/admin', icon: Shield }];

// Filter nav items based on user role
function useVisibleNav() {
  const user = useAuthStore((state) => state.user);
  return React.useMemo(() => {
    if (user?.role === 'platform_admin') return [...mainNav, ...adminNav];
    return mainNav;
  }, [user?.role]);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, sidebarCollapsed, toggleSidebarCollapsed, setSidebarOpen } = useUIStore();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const visibleNav = useVisibleNav();

  return (
    <>
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSidebarOpen(false);
          }}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white transition-all duration-300 lg:static lg:z-0',
          sidebarCollapsed ? 'w-[70px]' : 'w-[260px]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!sidebarCollapsed && (
            <Link href={ROUTES.protected.dashboard} className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">RestaurantOS</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggleSidebarCollapsed} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {!isDesktop && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {visibleNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              const link = (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  onClick={() => !isDesktop && setSidebarOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
              return sidebarCollapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger>
                    {link}
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.href}>{link}</div>
              );
            })}
          </nav>
        </ScrollArea>
        <div className={cn('border-t p-4', sidebarCollapsed && 'flex justify-center')}>
          <div className={cn('flex items-center gap-3', sidebarCollapsed && 'flex-col')}>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
