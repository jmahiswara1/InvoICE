import { query, execute } from "@/lib/database";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Invoice, InvoiceItem } from "@/types";

export const invoiceService = {
  async getAll(userId: string): Promise<Invoice[]> {
    return query<Invoice>(
      `SELECT i.*, c.name as client_name 
       FROM invoices i 
       LEFT JOIN clients c ON i.client_id = c.id 
       WHERE i.user_id = $1 
       ORDER BY i.created_at DESC`,
      [userId]
    );
  },

  async getById(id: number): Promise<Invoice | null> {
    const results = query<Invoice>(
      `SELECT i.*, c.name as client_name 
       FROM invoices i 
       LEFT JOIN clients c ON i.client_id = c.id 
       WHERE i.id = $1`,
      [id]
    );
    return (await results)[0] || null;
  },

  async getByStatus(userId: string, status: string): Promise<Invoice[]> {
    return query<Invoice>(
      `SELECT i.*, c.name as client_name 
       FROM invoices i 
       LEFT JOIN clients c ON i.client_id = c.id 
       WHERE i.user_id = $1 AND i.status = $2 
       ORDER BY i.created_at DESC`,
      [userId, status]
    );
  },

  async generateInvoiceNumber(userId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = useSettingsStore.getState().invoicePrefix || "INV";
    const results = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM invoices 
       WHERE user_id = $1 AND invoice_number LIKE $2`,
      [userId, `%/${year}/%`]
    );
    const seq = (results[0]?.count || 0) + 1;
    return `${prefix}/${year}/${String(seq).padStart(3, "0")}`;
  },

  async create(
    data: Omit<
      Invoice,
      | "id"
      | "subtotal"
      | "discount_amount"
      | "tax_amount"
      | "total"
      | "paid_at"
      | "sent_at"
      | "cloud_id"
      | "synced_at"
      | "created_at"
      | "updated_at"
    >
  ): Promise<Invoice> {
    const result = await execute(
      `INSERT INTO invoices (
        user_id, client_id, invoice_number, status, template,
        issue_date, due_date, currency, exchange_rate,
        discount_type, discount_value, tax_enabled, tax_rate,
        shipping_cost, notes, terms, is_recurring, recurring_interval,
        recurring_next_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        data.user_id,
        data.client_id,
        data.invoice_number,
        data.status,
        data.template,
        data.issue_date,
        data.due_date,
        data.currency,
        data.exchange_rate,
        data.discount_type,
        data.discount_value,
        data.tax_enabled,
        data.tax_rate,
        data.shipping_cost,
        data.notes,
        data.terms,
        data.is_recurring,
        data.recurring_interval,
        data.recurring_next_date,
      ]
    );
    const invoice = await this.getById(result.lastInsertId);
    return invoice!;
  },

  async updateStatus(
    id: number,
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  ): Promise<void> {
    let extra = "";
    if (status === "sent") {
      extra = ", sent_at = CURRENT_TIMESTAMP";
    } else if (status === "paid") {
      extra = ", paid_at = CURRENT_TIMESTAMP";
    }
    await execute(
      `UPDATE invoices SET status = $1, updated_at = CURRENT_TIMESTAMP${extra} WHERE id = $2`,
      [status, id]
    );
  },

  async updateTotals(
    id: number,
    totals: {
      subtotal: number;
      discount_amount: number;
      tax_amount: number;
      shipping_cost: number;
      total: number;
    }
  ): Promise<void> {
    await execute(
      `UPDATE invoices SET 
        subtotal = $1, discount_amount = $2, tax_amount = $3, 
        shipping_cost = $4, total = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6`,
      [
        totals.subtotal,
        totals.discount_amount,
        totals.tax_amount,
        totals.shipping_cost,
        totals.total,
        id,
      ]
    );
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM invoice_items WHERE invoice_id = $1", [id]);
    await execute("DELETE FROM invoices WHERE id = $1", [id]);
  },

  async search(userId: string, searchStr: string): Promise<Invoice[]> {
    return query<Invoice>(
      `SELECT i.*, c.name as client_name 
       FROM invoices i 
       LEFT JOIN clients c ON i.client_id = c.id 
       WHERE i.user_id = $1 AND (i.invoice_number LIKE $2 OR c.name LIKE $3)
       ORDER BY i.created_at DESC`,
      [userId, `%${searchStr}%`, `%${searchStr}%`]
    );
  },

  // Invoice Items
  async getItems(invoiceId: number): Promise<InvoiceItem[]> {
    return query<InvoiceItem>(
      "SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY sort_order ASC",
      [invoiceId]
    );
  },

  async createItem(
    data: Omit<InvoiceItem, "id" | "amount">
  ): Promise<InvoiceItem> {
    const amount = data.quantity * data.unit_price;
    const result = await execute(
      `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.invoice_id,
        data.description,
        data.quantity,
        data.unit_price,
        amount,
        data.sort_order,
      ]
    );
    const items = await query<InvoiceItem>(
      "SELECT * FROM invoice_items WHERE id = $1",
      [result.lastInsertId]
    );
    return items[0];
  },

  async updateItem(
    id: number,
    data: Partial<Pick<InvoiceItem, "description" | "quantity" | "unit_price" | "sort_order">>
  ): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${paramIndex++}`);
      values.push(data.quantity);
    }
    if (data.unit_price !== undefined) {
      fields.push(`unit_price = $${paramIndex++}`);
      values.push(data.unit_price);
    }
    if (data.sort_order !== undefined) {
      fields.push(`sort_order = $${paramIndex++}`);
      values.push(data.sort_order);
    }

    if (data.quantity !== undefined || data.unit_price !== undefined) {
      const item = await query<InvoiceItem>(
        "SELECT * FROM invoice_items WHERE id = $1",
        [id]
      );
      if (item[0]) {
        const qty = data.quantity ?? item[0].quantity;
        const price = data.unit_price ?? item[0].unit_price;
        fields.push(`amount = $${paramIndex++}`);
        values.push(qty * price);
      }
    }

    values.push(id);
    await execute(
      `UPDATE invoice_items SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values
    );
  },

  async deleteItem(id: number): Promise<void> {
    await execute("DELETE FROM invoice_items WHERE id = $1", [id]);
  },

  async recalculateInvoice(invoiceId: number): Promise<void> {
    const items = await this.getItems(invoiceId);
    const invoice = await this.getById(invoiceId);
    if (!invoice) return;

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    let discount_amount = 0;
    if (invoice.discount_type === "percentage") {
      discount_amount = (subtotal * invoice.discount_value) / 100;
    } else if (invoice.discount_type === "fixed") {
      discount_amount = invoice.discount_value;
    }

    const afterDiscount = subtotal - discount_amount;
    const tax_amount = invoice.tax_enabled
      ? (afterDiscount * invoice.tax_rate) / 100
      : 0;
    const total = afterDiscount + tax_amount + invoice.shipping_cost;

    await this.updateTotals(invoiceId, {
      subtotal,
      discount_amount,
      tax_amount,
      shipping_cost: invoice.shipping_cost,
      total,
    });
  },
};
