// store/filterStore.ts
import { create } from "zustand";

interface FilterState {
  category: string | null;
  setCategory: (cat: string | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: null,
  setCategory: (cat) => set({ category: cat }),
}));
