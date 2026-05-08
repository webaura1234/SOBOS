'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({ placeholder = 'Search...', value = '', onChange, className }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => { onChange(debouncedValue); }, [debouncedValue]);

  useEffect(() => { setLocalValue(value); }, [value]);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8"
      />
      {localValue && (
        <button onClick={() => setLocalValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
