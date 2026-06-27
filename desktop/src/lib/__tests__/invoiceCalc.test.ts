import { describe, it, expect } from "vitest";
import {
  calculateInvoiceTotals,
  calculateNextDate,
  daysUntil,
} from "../invoiceCalc";

describe("calculateInvoiceTotals", () => {
  const items = [
    { quantity: 2, unit_price: 50000 },
    { quantity: 1, unit_price: 100000 },
  ];

  it("should calculate subtotal correctly", () => {
    const result = calculateInvoiceTotals(items, "none", 0, false, 0, 0);
    expect(result.subtotal).toBe(200000);
  });

  it("should calculate total without discount or tax", () => {
    const result = calculateInvoiceTotals(items, "none", 0, false, 0, 0);
    expect(result.total).toBe(200000);
    expect(result.discount_amount).toBe(0);
    expect(result.tax_amount).toBe(0);
  });

  it("should apply percentage discount", () => {
    const result = calculateInvoiceTotals(items, "percentage", 10, false, 0, 0);
    expect(result.discount_amount).toBe(20000);
    expect(result.total).toBe(180000);
  });

  it("should apply fixed discount", () => {
    const result = calculateInvoiceTotals(items, "fixed", 15000, false, 0, 0);
    expect(result.discount_amount).toBe(15000);
    expect(result.total).toBe(185000);
  });

  it("should apply tax", () => {
    const result = calculateInvoiceTotals(items, "none", 0, true, 11, 0);
    expect(result.tax_amount).toBe(22000);
    expect(result.total).toBe(222000);
  });

  it("should apply discount then tax", () => {
    const result = calculateInvoiceTotals(items, "percentage", 10, true, 11, 0);
    expect(result.subtotal).toBe(200000);
    expect(result.discount_amount).toBe(20000);
    expect(result.tax_amount).toBeCloseTo(19800);
    expect(result.total).toBeCloseTo(199800);
  });

  it("should add shipping cost", () => {
    const result = calculateInvoiceTotals(items, "none", 0, false, 0, 5000);
    expect(result.total).toBe(205000);
  });

  it("should handle empty items", () => {
    const result = calculateInvoiceTotals([], "none", 0, false, 0, 0);
    expect(result.subtotal).toBe(0);
    expect(result.total).toBe(0);
  });

  it("should handle all together", () => {
    const result = calculateInvoiceTotals(items, "fixed", 10000, true, 10, 5000);
    expect(result.subtotal).toBe(200000);
    expect(result.discount_amount).toBe(10000);
    expect(result.tax_amount).toBeCloseTo(19000);
    expect(result.total).toBeCloseTo(214000);
  });
});

describe("calculateNextDate", () => {
  it("should add 1 month", () => {
    expect(calculateNextDate("2026-01-15", "monthly")).toBe("2026-02-15");
  });

  it("should add 3 months", () => {
    expect(calculateNextDate("2026-01-15", "quarterly")).toBe("2026-04-15");
  });

  it("should add 1 year", () => {
    expect(calculateNextDate("2026-01-15", "yearly")).toBe("2027-01-15");
  });

  it("should handle month overflow", () => {
    expect(calculateNextDate("2026-01-31", "monthly")).toBe("2026-03-03");
  });
});

describe("daysUntil", () => {
  it("should return positive for future dates", () => {
    const future = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];
    expect(daysUntil(future)).toBeGreaterThanOrEqual(4);
    expect(daysUntil(future)).toBeLessThanOrEqual(6);
  });

  it("should return negative for past dates", () => {
    const past = new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0];
    expect(daysUntil(past)).toBeLessThan(0);
  });
});