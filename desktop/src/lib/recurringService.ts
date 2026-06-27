import { query, execute } from "@/lib/database";
import type { RecurringTemplate, RecurringTemplateItem } from "@/types";
import { invoiceService } from "./invoiceService";

export const recurringService = {
  async getAll(userId: string): Promise<RecurringTemplate[]> {
    return query<RecurringTemplate>(
      `SELECT * FROM recurring_templates WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
  },

  async getById(id: number): Promise<RecurringTemplate | null> {
    const results = query<RecurringTemplate>(
      "SELECT * FROM recurring_templates WHERE id = $1",
      [id]
    );
    return (await results)[0] || null;
  },

  async getItems(templateId: number): Promise<RecurringTemplateItem[]> {
    return query<RecurringTemplateItem>(
      "SELECT * FROM recurring_template_items WHERE template_id = $1 ORDER BY sort_order ASC",
      [templateId]
    );
  },

  async create(
    data: Omit<RecurringTemplate, "id" | "created_at">
  ): Promise<RecurringTemplate> {
    const result = await execute(
      `INSERT INTO recurring_templates 
        (user_id, name, client_id, template, interval, next_generate_date, currency, tax_enabled, tax_rate, notes, terms, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        data.user_id,
        data.name,
        data.client_id,
        data.template,
        data.interval,
        data.next_generate_date,
        data.currency,
        data.tax_enabled,
        data.tax_rate,
        data.notes,
        data.terms,
        data.is_active,
      ]
    );
    const template = await this.getById(result.lastInsertId);
    return template!;
  },

  async addItem(
    data: Omit<RecurringTemplateItem, "id">
  ): Promise<RecurringTemplateItem> {
    const result = await execute(
      `INSERT INTO recurring_template_items (template_id, description, quantity, unit_price, sort_order) VALUES ($1, $2, $3, $4, $5)`,
      [data.template_id, data.description, data.quantity, data.unit_price, data.sort_order]
    );
    const items = await query<RecurringTemplateItem>(
      "SELECT * FROM recurring_template_items WHERE id = $1",
      [result.lastInsertId]
    );
    return items[0];
  },

  async update(
    id: number,
    data: Partial<Omit<RecurringTemplate, "id" | "user_id" | "created_at">>
  ): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const allowedFields: (keyof typeof data)[] = [
      "name", "client_id", "template", "interval", "next_generate_date",
      "currency", "tax_enabled", "tax_rate", "notes", "terms", "is_active"
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(data[field]);
      }
    }

    if (fields.length === 0) return;
    values.push(id);
    await execute(
      `UPDATE recurring_templates SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values
    );
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM recurring_template_items WHERE template_id = $1", [id]);
    await execute("DELETE FROM recurring_templates WHERE id = $1", [id]);
  },

  async getDueForGeneration(userId: string): Promise<RecurringTemplate[]> {
    const today = new Date().toISOString().split("T")[0];
    return query<RecurringTemplate>(
      `SELECT * FROM recurring_templates 
       WHERE user_id = $1 AND is_active = 1 
       AND next_generate_date <= $2`,
      [userId, today]
    );
  },

  async generateInvoice(templateId: number, userId: string): Promise<number> {
    const template = await this.getById(templateId);
    if (!template) throw new Error("Template not found");

    const items = await this.getItems(templateId);
    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 30 * 86400000)
      .toISOString()
      .split("T")[0];
    const invoiceNumber = await invoiceService.generateInvoiceNumber(userId);

    const invoice = await invoiceService.create({
      user_id: userId,
      client_id: template.client_id,
      invoice_number: invoiceNumber,
      status: "draft",
      template: template.template as "minimalis" | "profesional" | "kreatif",
      issue_date: today,
      due_date: dueDate,
      currency: template.currency,
      exchange_rate: 1,
      discount_type: "none",
      discount_value: 0,
      tax_enabled: template.tax_enabled,
      tax_rate: template.tax_rate,
      shipping_cost: 0,
      notes: template.notes,
      terms: template.terms,
      is_recurring: 1,
      recurring_interval: template.interval,
      recurring_next_date: null,
    });

    for (let i = 0; i < items.length; i++) {
      await invoiceService.createItem({
        invoice_id: invoice.id,
        description: items[i].description,
        quantity: items[i].quantity,
        unit_price: items[i].unit_price,
        sort_order: i,
      });
    }

    await invoiceService.recalculateInvoice(invoice.id);

    // Update next_generate_date
    const nextDate = calculateNextDate(template.next_generate_date!, template.interval);
    await this.update(templateId, { next_generate_date: nextDate });

    return invoice.id;
  },
};

function calculateNextDate(currentDate: string, interval: string): string {
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