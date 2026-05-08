import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Inbox, Plus, SearchX, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'alert' | 'custom';
  title: string;
  description?: string;
  actionLabel?: string;
  action?: () => void;
  customIcon?: ReactNode;
}

export function EmptyState({ icon = 'inbox', title, description, actionLabel, action, customIcon }: EmptyStateProps) {
  const icons = {
    inbox: <Inbox className="h-12 w-12 text-muted-foreground/50" />,
    search: <SearchX className="h-12 w-12 text-muted-foreground/50" />,
    alert: <AlertCircle className="h-12 w-12 text-muted-foreground/50" />,
    custom: customIcon,
  };

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">{icons[icon]}</div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && action && (
        <Button onClick={action}>
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
