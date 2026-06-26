export interface User {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  address: string | null;
  phone: string | null;
  currency: string;
  language: string;
  tax_rate: number;
  invoice_prefix: string;
  invoice_format: string;
  license_type: "free" | "paid";
  license_key: string | null;
  synced_at: string | null;
  created_at: string;
}

export interface Client {
  id: number;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  user_id: string;
  client_id: number;
  invoice_number: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  template: "minimalis" | "profesional" | "kreatif";
  issue_date: string;
  due_date: string;
  currency: string;
  exchange_rate: number;
  subtotal: number;
  discount_type: "none" | "percentage" | "fixed";
  discount_value: number;
  discount_amount: number;
  tax_enabled: number;
  tax_rate: number;
  tax_amount: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  terms: string | null;
  is_recurring: number;
  recurring_interval: string | null;
  recurring_next_date: string | null;
  paid_at: string | null;
  sent_at: string | null;
  cloud_id: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
}

export interface RecurringTemplate {
  id: number;
  user_id: string;
  name: string;
  client_id: number;
  template: string;
  interval: "monthly" | "quarterly" | "yearly";
  next_generate_date: string | null;
  currency: string;
  tax_enabled: number;
  tax_rate: number;
  notes: string | null;
  terms: string | null;
  is_active: number;
  created_at: string;
}

export interface RecurringTemplateItem {
  id: number;
  template_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

export interface Reminder {
  id: number;
  invoice_id: number;
  remind_date: string;
  message: string | null;
  is_sent: number;
  sent_at: string | null;
  created_at: string;
}
