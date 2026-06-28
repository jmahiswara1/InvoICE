"use client";

import { useState, useEffect } from "react";
import { Users, FileText, DollarSign, Key } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { supabase } from "@/lib/supabase";
import type { AdminStats } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    activeLicenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, invoicesRes, licensesRes] = await Promise.all([
        supabase.from("users").select("id", { count: "exact" }),
        supabase.from("invoices").select("id", { count: "exact" }),
        supabase.from("licenses").select("id", { count: "exact" }).eq("is_active", true),
      ]);

      const { data: revenueData } = await supabase
        .from("invoices")
        .select("total")
        .eq("status", "paid");

      const totalRevenue = revenueData?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

      setStats({
        totalUsers: usersRes.count || 0,
        totalInvoices: invoicesRes.count || 0,
        totalRevenue,
        activeLicenses: licensesRes.count || 0,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Invoices",
      value: stats.totalInvoices.toString(),
      icon: FileText,
      description: "All invoices created",
    },
    {
      title: "Revenue",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      description: "From paid invoices",
    },
    {
      title: "Active Licenses",
      value: stats.activeLicenses.toString(),
      icon: Key,
      description: "Paid licenses",
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading stats...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of Invoice application statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.title} className="border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold font-mono mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="w-8 h-8 border flex items-center justify-center">
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}