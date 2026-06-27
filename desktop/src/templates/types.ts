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
    payment_terms: string | null;
    customer_message: string | null;
  };
  client: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    ship_to_name: string | null;
    ship_to_address: string | null;
    ship_to_city: string | null;
    ship_to_postal_code: string | null;
  };
  items: {
    description: string;
    item_description: string | null;
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
    website: string | null;
  };
  payment_instructions: {
    bank_name: string | null;
    account_number: string | null;
    account_holder: string | null;
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

export interface InvoiceFormData {
  client_id: number;
  invoice_number: string;
  template: "minimalis" | "profesional" | "kreatif";
  issue_date: string;
  due_date: string;
  currency: string;
  tax_enabled: boolean;
  tax_rate: number;
  discount_type: "none" | "percentage" | "fixed";
  discount_value: number;
  shipping_cost: number;
  notes: string;
  terms: string;
  items: { description: string; quantity: number; unit_price: number }[];
}

export function buildInvoiceTemplateData(
  form: InvoiceFormData,
  client: { name: string; email?: string | null; phone?: string | null; address?: string | null; city?: string | null; postal_code?: string | null } | null,
  business: { name: string; address?: string | null; email?: string | null; phone?: string | null }
): InvoiceTemplateData {
  const items = form.items.map((item) => ({
    description: item.description,
    item_description: null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    amount: item.quantity * item.unit_price,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  let discount_amount = 0;
  if (form.discount_type === "percentage") {
    discount_amount = (subtotal * form.discount_value) / 100;
  } else if (form.discount_type === "fixed") {
    discount_amount = form.discount_value;
  }

  const afterDiscount = subtotal - discount_amount;
  const tax_amount = form.tax_enabled
    ? (afterDiscount * form.tax_rate) / 100
    : 0;
  const total = afterDiscount + tax_amount + form.shipping_cost;

  return {
    invoice: {
      invoice_number: form.invoice_number,
      issue_date: form.issue_date,
      due_date: form.due_date,
      currency: form.currency,
      subtotal,
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      discount_amount,
      tax_enabled: form.tax_enabled,
      tax_rate: form.tax_rate,
      tax_amount,
      shipping_cost: form.shipping_cost,
      total,
      notes: form.notes || null,
      terms: form.terms || null,
      status: "draft",
      payment_terms: form.terms || null,
      customer_message: form.notes || null,
    },
    client: {
      name: client?.name || "Client",
      email: client?.email || null,
      phone: client?.phone || null,
      address: client?.address || null,
      city: client?.city || null,
      postal_code: client?.postal_code || null,
      ship_to_name: null,
      ship_to_address: null,
      ship_to_city: null,
      ship_to_postal_code: null,
    },
    items,
    business: {
      name: business.name || "My Business",
      address: business.address || null,
      email: business.email || null,
      phone: business.phone || null,
      logo: null,
      website: null,
    },
    payment_instructions: {
      bank_name: null,
      account_number: null,
      account_holder: null,
    },
  };
}
