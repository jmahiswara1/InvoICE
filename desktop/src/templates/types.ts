export interface InvoiceTemplateData {
  invoice: {
    invoice_number: string;
    issue_date: string;
    due_date: string;
    currency: string;
    subtotal: number;
    discount_type: string;
    discount_value: number;
    discount_amount: number;
    tax_enabled: boolean;
    tax_rate: number;
    tax_amount: number;
    shipping_cost: number;
    total: number;
    notes: string | null;
    terms: string | null;
    status: string;
  };
  client: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
  };
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }[];
  business: {
    name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    logo: string | null;
  };
}

export function formatCurrency(amount: number, currency = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
