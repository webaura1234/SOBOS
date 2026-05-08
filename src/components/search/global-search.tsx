'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useUIStore } from '@/store/ui-store';
import { Search, Store, ShoppingCart, UtensilsCrossed, Users, FileText, Settings } from 'lucide-react';
import { ROUTES } from '@/config/routes';

const searchItems = [
  { label: 'Dashboard', href: ROUTES.protected.dashboard, icon: Search, group: 'Navigation' },
  { label: 'Restaurants', href: ROUTES.protected.restaurants, icon: Store, group: 'Navigation' },
  { label: 'Orders', href: ROUTES.protected.orders, icon: ShoppingCart, group: 'Navigation' },
  { label: 'Menu', href: ROUTES.protected.menu, icon: UtensilsCrossed, group: 'Navigation' },
  { label: 'Staff', href: ROUTES.protected.staff, icon: Users, group: 'Navigation' },
  { label: 'Reports', href: ROUTES.protected.reports, icon: FileText, group: 'Navigation' },
  { label: 'Settings', href: ROUTES.protected.settings, icon: Settings, group: 'Navigation' },
];

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(searchOpen); }, [searchOpen]);

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
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setSearchOpen(o); }}>
      <DialogContent className="max-w-[600px] p-0 gap-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command>
          <CommandInput placeholder="Type a command or search..." className="border-none h-12" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {searchItems.map((item) => (
                <CommandItem key={item.href} onSelect={() => handleSelect(item.href)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
