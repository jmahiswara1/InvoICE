import { supabase } from "./supabase";
import { query, execute } from "./database";
import { useSettingsStore } from "@/stores/settingsStore";
import { getLocalUserId, LOCAL_USER_UUID } from "./userId";
import type { Client, Invoice, InvoiceItem } from "@/types";

export interface SyncResult {
  pushed: number;
  pulled: number;
  conflicts: number;
  errors: string[];
}

export const syncService = {
  async pushClients(): Promise<{ pushed: number; errors: string[] }> {
    const errors: string[] = [];
    let pushed = 0;
    const userId = getLocalUserId();

    try {
      const localClients = await query<Client>(
        "SELECT * FROM clients WHERE user_id = $1",
        [LOCAL_USER_UUID]
      );

      for (const client of localClients) {
        try {
          const { data: existing } = await supabase
            .from("clients")
            .select("id, updated_at")
            .eq("local_id", client.id)
            .eq("user_id", userId)
            .single();

          const clientData = {
            user_id: userId,
            local_id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            postal_code: client.postal_code,
            notes: client.notes,
            updated_at: client.updated_at,
            synced_at: new Date().toISOString(),
          };

          if (existing) {
            await supabase
              .from("clients")
              .update(clientData)
              .eq("id", existing.id);
          } else {
            await supabase.from("clients").insert(clientData);
          }
          pushed++;
        } catch (err) {
          errors.push(`Client ${client.id}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      errors.push(`Push clients failed: ${(err as Error).message}`);
    }

    return { pushed, errors };
  },

  async pushInvoices(): Promise<{ pushed: number; errors: string[] }> {
    const errors: string[] = [];
    let pushed = 0;
    const userId = getLocalUserId();

    try {
      const localInvoices = await query<Invoice>(
        "SELECT * FROM invoices WHERE user_id = $1",
        [LOCAL_USER_UUID]
      );

      for (const invoice of localInvoices) {
        try {
          const { data: existing } = await supabase
            .from("invoices")
            .select("id, updated_at")
            .eq("local_id", invoice.id)
            .eq("user_id", userId)
            .single();

          const invoiceData = {
            user_id: userId,
            local_id: invoice.id,
            client_local_id: invoice.client_id,
            invoice_number: invoice.invoice_number,
            status: invoice.status,
            template: invoice.template,
            issue_date: invoice.issue_date,
            due_date: invoice.due_date,
            currency: invoice.currency,
            exchange_rate: invoice.exchange_rate,
            subtotal: invoice.subtotal,
            discount_type: invoice.discount_type,
            discount_value: invoice.discount_value,
            discount_amount: invoice.discount_amount,
            tax_enabled: invoice.tax_enabled,
            tax_rate: invoice.tax_rate,
            tax_amount: invoice.tax_amount,
            shipping_cost: invoice.shipping_cost,
            total: invoice.total,
            notes: invoice.notes,
            terms: invoice.terms,
            is_recurring: invoice.is_recurring,
            recurring_interval: invoice.recurring_interval,
            recurring_next_date: invoice.recurring_next_date,
            paid_at: invoice.paid_at,
            sent_at: invoice.sent_at,
            updated_at: invoice.updated_at,
            synced_at: new Date().toISOString(),
          };

          if (existing) {
            await supabase
              .from("invoices")
              .update(invoiceData)
              .eq("id", existing.id);
          } else {
            await supabase.from("invoices").insert(invoiceData);
          }

          // Push invoice items
          const items = await query<InvoiceItem>(
            "SELECT * FROM invoice_items WHERE invoice_id = $1",
            [invoice.id]
          );

          for (const item of items) {
            const itemData = {
              invoice_local_id: invoice.id,
              local_id: item.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
              sort_order: item.sort_order,
              updated_at: new Date().toISOString(),
              synced_at: new Date().toISOString(),
            };

            const { data: existingItem } = await supabase
              .from("invoice_items")
              .select("id")
              .eq("local_id", item.id)
              .eq("invoice_local_id", invoice.id)
              .single();

            if (existingItem) {
              await supabase.from("invoice_items").update(itemData).eq("id", existingItem.id);
            } else {
              await supabase.from("invoice_items").insert(itemData);
            }
          }

          pushed++;
        } catch (err) {
          errors.push(`Invoice ${invoice.id}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      errors.push(`Push invoices failed: ${(err as Error).message}`);
    }

    return { pushed, errors };
  },

  async pullClients(lastSyncAt: string): Promise<{ pulled: number; errors: string[] }> {
    const errors: string[] = [];
    let pulled = 0;
    const userId = getLocalUserId();

    try {
      const { data: cloudClients, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", userId)
        .gt("synced_at", lastSyncAt)
        .is("deleted_at", null);

      if (error) throw error;

      for (const cloud of cloudClients || []) {
        try {
          const local = await query<Client>(
            "SELECT * FROM clients WHERE id = $1 AND user_id = $2",
            [cloud.local_id, LOCAL_USER_UUID]
          );

          if (local.length === 0) {
            await execute(
              "INSERT INTO clients (id, user_id, name, email, phone, address, city, postal_code, notes, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
              [cloud.local_id, "local-user", cloud.name, cloud.email, cloud.phone, cloud.address, cloud.city, cloud.postal_code, cloud.notes, cloud.created_at, cloud.updated_at]
            );
          } else {
            const localUpdated = new Date(local[0].updated_at).getTime();
            const cloudUpdated = new Date(cloud.updated_at).getTime();

            if (cloudUpdated > localUpdated) {
              await execute(
                "UPDATE clients SET name = $1, email = $2, phone = $3, address = $4, city = $5, postal_code = $6, notes = $7, updated_at = $8 WHERE id = $9 AND user_id = $10",
                [cloud.name, cloud.email, cloud.phone, cloud.address, cloud.city, cloud.postal_code, cloud.notes, cloud.updated_at, cloud.local_id, LOCAL_USER_UUID]
              );
            }
          }
          pulled++;
        } catch (err) {
          errors.push(`Pull client ${cloud.id}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      errors.push(`Pull clients failed: ${(err as Error).message}`);
    }

    return { pulled, errors };
  },

  async pullInvoices(lastSyncAt: string): Promise<{ pulled: number; errors: string[] }> {
    const errors: string[] = [];
    let pulled = 0;
    const userId = getLocalUserId();

    try {
      const { data: cloudInvoices, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .gt("synced_at", lastSyncAt)
        .is("deleted_at", null);

      if (error) throw error;

      for (const cloud of cloudInvoices || []) {
        try {
          const local = await query<Invoice>(
            "SELECT * FROM invoices WHERE id = $1 AND user_id = $2",
            [cloud.local_id, LOCAL_USER_UUID]
          );

          if (local.length === 0) {
            await execute(
              "INSERT INTO invoices (id, user_id, client_id, invoice_number, status, template, issue_date, due_date, currency, exchange_rate, subtotal, discount_type, discount_value, discount_amount, tax_enabled, tax_rate, tax_amount, shipping_cost, total, notes, terms, is_recurring, recurring_interval, recurring_next_date, paid_at, sent_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)",
                [cloud.local_id, LOCAL_USER_UUID, cloud.client_local_id, cloud.invoice_number, cloud.status, cloud.template, cloud.issue_date, cloud.due_date, cloud.currency, cloud.exchange_rate, cloud.subtotal, cloud.discount_type, cloud.discount_value, cloud.discount_amount, cloud.tax_enabled, cloud.tax_rate, cloud.tax_amount, cloud.shipping_cost, cloud.total, cloud.notes, cloud.terms, cloud.is_recurring, cloud.recurring_interval, cloud.recurring_next_date, cloud.paid_at, cloud.sent_at, cloud.created_at, cloud.updated_at]
            );
          } else {
            const localUpdated = new Date(local[0].updated_at).getTime();
            const cloudUpdated = new Date(cloud.updated_at).getTime();

            if (cloudUpdated > localUpdated) {
              await execute(
                "UPDATE invoices SET status = $1, subtotal = $2, discount_amount = $3, tax_amount = $4, shipping_cost = $5, total = $6, paid_at = $7, sent_at = $8, updated_at = $9 WHERE id = $10 AND user_id = $11",
                [cloud.status, cloud.subtotal, cloud.discount_amount, cloud.tax_amount, cloud.shipping_cost, cloud.total, cloud.paid_at, cloud.sent_at, cloud.updated_at, cloud.local_id, LOCAL_USER_UUID]
              );
            }
          }
          pulled++;
        } catch (err) {
          errors.push(`Pull invoice ${cloud.id}: ${(err as Error).message}`);
        }
      }
    } catch (err) {
      errors.push(`Pull invoices failed: ${(err as Error).message}`);
    }

    return { pulled, errors };
  },

  async sync(): Promise<SyncResult> {
    const result: SyncResult = { pushed: 0, pulled: 0, conflicts: 0, errors: [] };

    try {
      const lastSyncAt = useSettingsStore.getState().lastSyncAt || "1970-01-01T00:00:00Z";

      const pushClients = await this.pushClients();
      const pushInvoices = await this.pushInvoices();
      result.pushed = pushClients.pushed + pushInvoices.pushed;
      result.errors.push(...pushClients.errors, ...pushInvoices.errors);

      const pullClients = await this.pullClients(lastSyncAt);
      const pullInvoices = await this.pullInvoices(lastSyncAt);
      result.pulled = pullClients.pulled + pullInvoices.pulled;
      result.errors.push(...pullClients.errors, ...pullInvoices.errors);

      const now = new Date().toISOString();
      useSettingsStore.getState().setLastSyncAt(now);
    } catch (err) {
      result.errors.push(`Sync failed: ${(err as Error).message}`);
    }

    return result;
  },
};