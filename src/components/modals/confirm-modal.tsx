'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmModal({ open, onOpenChange, title, description, onConfirm, variant = 'default', confirmLabel = 'Confirm', cancelLabel = 'Cancel' }: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={() => { onConfirm(); onOpenChange(false); }}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
