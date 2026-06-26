import { create } from "zustand";
import type { Invoice, InvoiceItem } from "@/types";

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  currentItems: InvoiceItem[];
  isLoading: boolean;
  setInvoices: (invoices: Invoice[]) => void;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  setCurrentItems: (items: InvoiceItem[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: number, data: Partial<Invoice>) => void;
  removeInvoice: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  currentInvoice: null,
  currentItems: [],
  isLoading: false,
  setInvoices: (invoices) => set({ invoices }),
  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
  setCurrentItems: (items) => set({ currentItems: items }),
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),
  updateInvoice: (id, data) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...data } : inv
      ),
    })),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
