import { query, execute } from "@/lib/database";
import type { Reminder } from "@/types";

export const reminderService = {
  async getByInvoice(invoiceId: number): Promise<Reminder[]> {
    return query<Reminder>(
      "SELECT * FROM reminders WHERE invoice_id = $1 ORDER BY remind_date ASC",
      [invoiceId]
    );
  },

  async getUnsent(): Promise<Reminder[]> {
    return query<Reminder>(
      "SELECT * FROM reminders WHERE is_sent = 0 ORDER BY remind_date ASC"
    );
  },

  async create(data: Omit<Reminder, "id" | "is_sent" | "sent_at" | "created_at">): Promise<Reminder> {
    const result = await execute(
      `INSERT INTO reminders (invoice_id, remind_date, message) VALUES ($1, $2, $3)`,
      [data.invoice_id, data.remind_date, data.message]
    );
    const reminders = await query<Reminder>(
      "SELECT * FROM reminders WHERE id = $1",
      [result.lastInsertId]
    );
    return reminders[0];
  },

  async markAsSent(id: number): Promise<void> {
    await execute(
      "UPDATE reminders SET is_sent = 1, sent_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM reminders WHERE id = $1", [id]);
  },

  async getOverdueAndDueSoon(userId: string, daysAhead: number = 7): Promise<any[]> {
    const future = new Date(Date.now() + daysAhead * 86400000)
      .toISOString()
      .split("T")[0];

    return query(
      `SELECT i.id as invoice_id, i.invoice_number, i.total, i.currency,
              i.due_date, i.status, c.name as client_name
       FROM invoices i
       LEFT JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = $1 AND i.status = '"'"'sent'"'"'
       AND i.due_date <= $2
       ORDER BY i.due_date ASC`,
      [userId, future]
    );
  },
};