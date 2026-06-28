import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  DollarSign,
  Clock,
  Plus,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { TopClientsChart } from "@/components/dashboard/top-clients-chart";
import { dashboardService } from "@/lib/dashboardService";
import { statusConfig, type InvoiceWithClient } from "@/lib/constants";
import { formatCurrency, formatCurrencyShort } from "@/lib/currencyService";
import { daysUntil } from "@/lib/invoiceCalc";
import { getLocalUserId } from "@/lib/userId";
import type {
  SummaryStats,
  MonthlyRevenue,
  StatusDistribution,
  TopClient,
} from "@/lib/dashboardService";
import type { Invoice } from "@/types";

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
  const [statusDist, setStatusDist] = useState<StatusDistribution[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [upcomingDue, setUpcomingDue] = useState<Invoice[]>([]);
  const [overdueInvoices, setOverdueInvoices] = useState<Invoice[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [avgPaymentTime, setAvgPaymentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const userId = getLocalUserId();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [
        statsData,
        revenueData,
        statusData,
        recentData,
        upcomingData,
        overdueData,
        topClientsData,
        avgPaymentData,
      ] = await Promise.all([
        dashboardService.getSummaryStats(userId),
        dashboardService.getMonthlyRevenue(userId),
        dashboardService.getStatusDistribution(userId),
        dashboardService.getRecentInvoices(userId),
        dashboardService.getUpcomingDue(userId),
        dashboardService.getOverdueInvoices(userId),
        dashboardService.getTopClients(userId),
        dashboardService.getAveragePaymentTime(userId),
      ]);

      setStats(statsData);
      setRevenue(revenueData);
      setStatusDist(statusData);
      setRecentInvoices(recentData);
      setUpcomingDue(upcomingData);
      setOverdueInvoices(overdueData);
      setTopClients(topClientsData);
      setAvgPaymentTime(avgPaymentData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const summaryCards = [
    {
      title: "Total Invoice",
      value: stats?.total_invoices?.toString() || "0",
      icon: FileText,
      sub: "Semua invoice",
    },
    {
      title: "Revenue",
      value: formatCurrencyShort(stats?.revenue_this_month || 0),
      icon: DollarSign,
      sub: "Bulan ini",
    },
    {
      title: "Outstanding",
      value: formatCurrencyShort(stats?.outstanding_amount || 0),
      icon: TrendingUp,
      sub: "Belum dibayar",
    },
    {
      title: "Overdue",
      value: (stats?.overdue_count || 0).toString(),
      icon: AlertTriangle,
      sub: "Jatuh tempo lewat",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali! Berikut ringkasan bisnis Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/clients?action=new")}>
            <Plus className="h-4 w-4" />
            Tambah Client
          </Button>
          <Button size="sm" className="gap-2" onClick={() => navigate("/invoices?action=new")}>
            <FileText className="h-4 w-4" />
            Buat Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold font-mono mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.sub}
                  </p>
                </div>
                <div className="w-8 h-8 border flex items-center justify-center">
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Revenue Bulanan</h3>
              <span className="text-xs text-muted-foreground">12 bulan terakhir</span>
            </div>
            <RevenueChart data={revenue} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-4">Status Distribusi</h3>
            <StatusChart data={statusDist} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Invoice Terbaru</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/invoices")}>
                Lihat semua
              </Button>
            </div>
            {recentInvoices.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Belum ada invoice"
              />
            ) : (
              <div className="space-y-2">
                {recentInvoices.map((inv) => {
                  const invoice = inv as InvoiceWithClient;
                  return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-mono font-medium">
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.client_name || "Unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-medium">
                        {formatCurrency(inv.total)}
                      </p>
                      <Badge variant={statusConfig[inv.status]?.variant}>
                        {statusConfig[inv.status]?.label}
                      </Badge>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Jatuh Tempo & Overdue</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                7 hari
              </div>
            </div>
            {overdueInvoices.length === 0 && upcomingDue.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Tidak ada invoice jatuh tempo"
              />
            ) : (
              <div className="space-y-2">
                {overdueInvoices.slice(0, 3).map((inv) => {
                  const invoice = inv as InvoiceWithClient;
                  return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between border-l-2 border-destructive pl-3"
                  >
                    <div>
                      <p className="text-sm font-mono font-medium">
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.client_name || "Unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-medium text-destructive">
                        {formatCurrency(inv.total)}
                      </p>
                      <p className="text-xs text-destructive">Overdue</p>
                    </div>
                  </div>
                  );
                })}
                {upcomingDue.slice(0, 3).map((inv) => {
                  const invoice = inv as InvoiceWithClient;
                  const days = daysUntil(inv.due_date);
                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between border-l-2 border-muted-foreground pl-3"
                    >
                      <div>
                        <p className="text-sm font-mono font-medium">
                          {inv.invoice_number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.client_name || "Unknown"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-medium">
                          {formatCurrency(inv.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {days <= 0 ? "Hari ini" : `${days} hari lagi`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-4">Top Clients</h3>
            <TopClientsChart data={topClients} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-4">Rata-rata Waktu Bayar</h3>
            <div className="text-center py-6">
              <p className="text-4xl font-bold font-mono">
                {avgPaymentTime > 0 ? avgPaymentTime.toFixed(1) : "—"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">hari</p>
              <p className="text-xs text-muted-foreground mt-4">
                Dari Sent ke Paid
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
