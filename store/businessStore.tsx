import { create } from "zustand";

export const useBusinessStore = create((set) => ({
  business: null,
  loading: false,
  setBusiness: (data: any) => set({ business: data }),
  setLoading: (value: any) => set({ loading: value }),
  updateBusiness: (updates: any) =>
    set((state: any) => ({
      business: {
        ...state.business,
        ...updates,
      },
    })),

  clearBusiness: () => set({ business: null }),
}));
