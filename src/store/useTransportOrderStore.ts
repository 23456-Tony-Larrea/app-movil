import { create } from "zustand";

interface TransportOrderStore {
  company: string;
  setCompanyInStore: (company: string) => void;
  getCompanyFromStore: () => string;
}

export const useTransportOrderStore = create<TransportOrderStore>((set, get) => ({
  company: "li", // Valor inicial
  setCompanyInStore: (company: string) => set({ company }),
  getCompanyFromStore: () => get().company,
}));