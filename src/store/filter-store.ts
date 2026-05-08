import { create } from 'zustand';

interface FilterState {
  filters: Record<string, Record<string, unknown>>;
  setFilters: (module: string, filters: Record<string, unknown>) => void;
  clearFilters: (module: string) => void;
  clearAllFilters: () => void;
  getFilters: (module: string) => Record<string, unknown>;
}

export const useFilterStore = create<FilterState>()((set, get) => ({
  filters: {},
  setFilters: (module, filters) =>
    set((state) => ({
      filters: { ...state.filters, [module]: { ...state.filters[module], ...filters } },
    })),
  clearFilters: (module) =>
    set((state) => {
      const newFilters = { ...state.filters };
      delete newFilters[module];
      return { filters: newFilters };
    }),
  clearAllFilters: () => set({ filters: {} }),
  getFilters: (module) => get().filters[module] || {},
}));
