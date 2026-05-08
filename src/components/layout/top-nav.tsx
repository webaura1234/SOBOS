'use client';

import { Menu, Search, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { useMediaQuery } from '@/hooks';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function TopNav() {
  const { toggleSidebar, setSearchOpen } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const { setTheme, theme } = useTheme();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      {!isDesktop && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <button
        className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-auto hidden h-5 items-center gap-1 rounded border bg-background px-1.5 text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
