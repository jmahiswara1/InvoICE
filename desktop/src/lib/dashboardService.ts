import { query } from "@/lib/database";
import type { Invoice } from "@/types";

export interface SummaryStats {
  total_invoices: number;
  paid_count: number;
  unpaid_count: number;
  overdue_count: number;
  revenue_this_month: number;
  outstanding_amount: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  label: string;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface TopClient {
  name: string;
  invoice_count: number;
  total_amount: number;
}

export interface AvgPaymentTime {
  avg_days: number;
}

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export const dashboardService = {
  async getSummaryStats(userId: string): Promise<SummaryStats> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}%`;

    const results = await query<SummaryStats>(
      `SELECT
        COUNT(*) as total_invoices,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN status IN ('sent', 'draft') THEN 1 ELSE 0 END) as unpaid_count,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
        COALESCE(SUM(CASE WHEN status = 'paid' AND strftime('%Y-%m', paid_at) LIKE $2 THEN total ELSE 0 END), 0) as revenue_this_month,
        COALESCE(SUM(CASE WHEN status IN ('sent', 'overdue') THEN total ELSE 0 END), 0) as outstanding_amount
       FROM invoices WHERE user_id = $1`,
      [userId, yearMonth]
    );
    return results[0] || {
      total_invoices: 0,
      paid_count: 0,
      unpaid_count: 0,
      overdue_count: 0,
      revenue_this_month: 0,
      outstanding_amount: 0,
    };
  },

  async getMonthlyRevenue(userId: string): Promise<MonthlyRevenue[]> {
    const results = await query<{ month: string; revenue: number }>(
      `SELECT 
        strftime('%Y-%m', paid_at) as month,
        SUM(total) as revenue
       FROM invoices 
       WHERE user_id = $1 AND status = 'paid' AND paid_at IS NOT NULL
       GROUP BY strftime('%Y-%m', paid_at)
       ORDER BY month DESC
       LIMIT 12`,
      [userId]
    );

    const reversed = [...results].reverse();
    return reversed.map((r) => {
      const [year, month] = r.month.split("-");
      const label = monthLabels[parseInt(month) - 1] || month;
      return { month: r.month, revenue: r.revenue || 0, label: `${label} ${year.slice(2)}` };
    });
  },

  async getStatusDistribution(userId: string): Promise<StatusDistribution[]> {
    const results = await query<{ status: string; count: number }>(
      `SELECT status, COUNT(*) as count
       FROM invoices WHERE user_id = $1
       GROUP BY status`,
      [userId]
    );
    return results.length > 0
      ? results
      : [
          { status: "draft", count: 0 },
          { status: "sent", count: 0 },
          { status: "paid", count: 0 },
          { status: "overdue", count: 0 },
          { status: "cancelled", count: 0 },
        ];
  },

  async getRecentInvoices(userId: string, limit = 5): Promise<Invoice[]> {
    return query<Invoice>(
      `SELECT i.*, c.name as client_name
       FROM invoices i
       LEFT JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
  },

  async getUpcomingDue(userId: string, daysAhead = 7): Promise<Invoice[]> {
    const today = new Date().toISOString().split("T")[0];
    const future = new Date(Date.now() + daysAhead * 86400000)
      .toISOString()
      .split("T")[0];

    return query<Invoice>(
      `SELECT i.*, c.name as client_name
       FROM invoices i
       LEFT JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = $1 AND i.status = 'sent'
       AND i.due_date >= $2 AND i.due_date <= $3
       ORDER BY i.due_date ASC`,
      [userId, today, future]
    );
  },

  async getOverdueInvoices(userId: string): Promise<Invoice[]> {
    const today = new Date().toISOString().split("T")[0];

    return query<Invoice>(
      `SELECT i.*, c.name as client_name
       FROM invoices i
       LEFT JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = $1 AND i.status = 'sent'
       AND i.due_date < $2
       ORDER BY i.due_date ASC`,
      [userId, today]
    );
  },

  async getTopClients(userId: string, limit = 5): Promise<TopClient[]> {
    return query<TopClient>(
      `SELECT c.name, COUNT(i.id) as invoice_count, COALESCE(SUM(i.total), 0) as total_amount
       FROM clients c
       JOIN invoices i ON i.client_id = c.id
       WHERE i.user_id = $1
       GROUP BY c.id, c.name
       ORDER BY invoice_count DESC
       LIMIT $2`,
      [userId, limit]
    );
  },

  async getAveragePaymentTime(userId: string): Promise<number> {
    const results = await query<{ avg_days: number | null }>(
      `SELECT AVG(julianday(paid_at) - julianday(sent_at)) as avg_days
       FROM invoices
       WHERE user_id = $1 AND status = 'paid' AND sent_at IS NOT NULL AND paid_at IS NOT NULL`,
      [userId]
    );
    return results[0]?.avg_days || 0;
  },
};
