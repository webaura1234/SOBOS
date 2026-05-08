'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useUIStore } from '@/store/ui-store';
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChefHat,
  Package,
  Table,
  Search,
} from 'lucide-react';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { label: 'Restaurants', href: '/restaurants', icon: Store, group: 'Navigation' },
  { label: 'Orders', href: '/orders', icon: ShoppingCart, group: 'Navigation' },
  { label: 'Menu', href: '/menu', icon: UtensilsCrossed, group: 'Navigation' },
  { label: 'Staff', href: '/staff', icon: Users, group: 'Navigation' },
  { label: 'Reports', href: '/reports', icon: BarChart3, group: 'Navigation' },
  { label: 'Settings', href: '/settings', icon: Settings, group: 'Navigation' },
];

const actionItems = [
  { label: 'Kitchen View', href: '/kitchen', icon: ChefHat, group: 'Operations' },
  { label: 'Inventory', href: '/inventory', icon: Package, group: 'Operations' },
  { label: 'Table Map', href: '/tables', icon: Table, group: 'Operations' },
  { label: 'Sign Out', href: '/auth/login', icon: LogOut, group: 'Actions' },
];

export function CommandPalette() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(searchOpen);
  }, [searchOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [searchOpen, setSearchOpen]);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearchOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={(o) => { setOpen(o); setSearchOpen(o); }}>
      <CommandInput placeholder="Search commands, pages, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => handleSelect(item.href)} className="gap-2">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Operations">
          {actionItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => handleSelect(item.href)} className="gap-2">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
