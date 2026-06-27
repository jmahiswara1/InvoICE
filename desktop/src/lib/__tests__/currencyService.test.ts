import { describe, it, expect } from "vitest";
import {
  currencies,
  getCurrency,
  formatCurrency,
  formatCurrencyShort,
  convertCurrency,
} from "../currencyService";

describe("currencies", () => {
  it("should contain 7 currencies", () => {
    expect(currencies).toHaveLength(7);
  });

  it("should have IDR as first currency", () => {
    expect(currencies[0].code).toBe("IDR");
  });
});

describe("getCurrency", () => {
  it("should return currency by code", () => {
    const usd = getCurrency("USD");
    expect(usd.code).toBe("USD");
    expect(usd.symbol).toBe("$");
  });

  it("should return IDR as default for unknown code", () => {
    const unknown = getCurrency("XXX");
    expect(unknown.code).toBe("IDR");
  });
});

describe("formatCurrency", () => {
  it("should format IDR without decimals", () => {
    const result = formatCurrency(1500000, "IDR");
    expect(result).toContain("1.500.000");
  });

  it("should format USD with 2 decimals", () => {
    const result = formatCurrency(1500.5, "USD");
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("should format JPY without decimals", () => {
    const result = formatCurrency(1500, "JPY");
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0, "IDR");
    expect(result).toContain("0");
  });
});

describe("formatCurrencyShort", () => {
  it("should format millions as M", () => {
    expect(formatCurrencyShort(1500000)).toBe("1.5M");
  });

  it("should format thousands as K", () => {
    expect(formatCurrencyShort(50000)).toBe("50K");
  });

  it("should keep small numbers as is", () => {
    const result = formatCurrencyShort(500);
    expect(result).toContain("500");
  });
});

describe("convertCurrency", () => {
  it("should return same amount for same currency", () => {
    expect(convertCurrency(100, "IDR", "IDR")).toBe(100);
  });

  it("should apply exchange rate", () => {
    expect(convertCurrency(100, "USD", "IDR", 15000)).toBe(1500000);
  });
});