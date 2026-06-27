export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: "IDR", name: "Rupiah", symbol: "Rp" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "\u20AC" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00A5" },
  { code: "GBP", name: "British Pound", symbol: "\u00A3" },
];

export function getCurrency(code: string): Currency {
  return currencies.find((c) => c.code === code) ?? currencies[0];
}

export function formatCurrency(
  amount: number,
  currency: string = "IDR",
  locale: string = "id-ID"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "IDR" || currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "IDR" || currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatCurrencyShort(
  amount: number,
  currency: string = "IDR"
): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return formatCurrency(amount, currency);
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number = 1
): number {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
}