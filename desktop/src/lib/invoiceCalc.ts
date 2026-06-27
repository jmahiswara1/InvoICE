export interface InvoiceTotals {
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
}

export function calculateInvoiceTotals(
  items: { quantity: number; unit_price: number }[],
  discountType: "none" | "percentage" | "fixed",
  discountValue: number,
  taxEnabled: boolean,
  taxRate: number,
  shippingCost: number
): InvoiceTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  let discount_amount = 0;
  if (discountType === "percentage") {
    discount_amount = (subtotal * discountValue) / 100;
  } else if (discountType === "fixed") {
    discount_amount = discountValue;
  }

  const afterDiscount = subtotal - discount_amount;
  const tax_amount = taxEnabled ? (afterDiscount * taxRate) / 100 : 0;
  const total = afterDiscount + tax_amount + shippingCost;

  return { subtotal, discount_amount, tax_amount, total };
}

export function calculateNextDate(
  currentDate: string,
  interval: "monthly" | "quarterly" | "yearly"
): string {
  const current = new Date(currentDate);
  switch (interval) {
    case "monthly":
      current.setMonth(current.getMonth() + 1);
      break;
    case "quarterly":
      current.setMonth(current.getMonth() + 3);
      break;
    case "yearly":
      current.setFullYear(current.getFullYear() + 1);
      break;
  }
  return current.toISOString().split("T")[0];
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}