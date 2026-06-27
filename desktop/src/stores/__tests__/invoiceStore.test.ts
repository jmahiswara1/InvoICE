import { describe, it, expect, beforeEach } from "vitest";
import { useInvoiceStore } from "../invoiceStore";
import type { Invoice } from "@/types";

const mockInvoice: Invoice = {
  id: 1,
  user_id: "local-user",
  client_id: 1,
  invoice_number: "INV/2026/001",
  status: "draft",
  template: "minimalis",
  issue_date: "2026-01-01",
  due_date: "2026-01-31",
  currency: "IDR",
  exchange_rate: 1,
  subtotal: 100000,
  discount_type: "none",
  discount_value: 0,
  discount_amount: 0,
  tax_enabled: 1,
  tax_rate: 11,
  tax_amount: 11000,
  shipping_cost: 0,
  total: 111000,
  notes: null,
  terms: null,
  is_recurring: 0,
  recurring_interval: null,
  recurring_next_date: null,
  paid_at: null,
  sent_at: null,
  cloud_id: null,
  synced_at: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("invoiceStore", () => {
  beforeEach(() => {
    useInvoiceStore.setState({
      invoices: [],
      currentInvoice: null,
      currentItems: [],
      isLoading: false,
    });
  });

  it("should have initial state", () => {
    const state = useInvoiceStore.getState();
    expect(state.invoices).toEqual([]);
    expect(state.currentInvoice).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("should set invoices", () => {
    useInvoiceStore.getState().setInvoices([mockInvoice]);
    expect(useInvoiceStore.getState().invoices).toHaveLength(1);
    expect(useInvoiceStore.getState().invoices[0].invoice_number).toBe("INV/2026/001");
  });

  it("should add invoice", () => {
    useInvoiceStore.getState().addInvoice(mockInvoice);
    expect(useInvoiceStore.getState().invoices).toHaveLength(1);
  });

  it("should update invoice", () => {
    useInvoiceStore.getState().setInvoices([mockInvoice]);
    useInvoiceStore.getState().updateInvoice(1, { status: "paid" });
    expect(useInvoiceStore.getState().invoices[0].status).toBe("paid");
  });

  it("should remove invoice", () => {
    useInvoiceStore.getState().setInvoices([mockInvoice]);
    useInvoiceStore.getState().removeInvoice(1);
    expect(useInvoiceStore.getState().invoices).toHaveLength(0);
  });

  it("should set loading", () => {
    useInvoiceStore.getState().setLoading(true);
    expect(useInvoiceStore.getState().isLoading).toBe(true);
  });

  it("should set current invoice", () => {
    useInvoiceStore.getState().setCurrentInvoice(mockInvoice);
    expect(useInvoiceStore.getState().currentInvoice?.id).toBe(1);
  });
});