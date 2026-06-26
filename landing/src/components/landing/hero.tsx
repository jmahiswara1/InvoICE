"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, Monitor, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline-First
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Buat Invoice{" "}
            <span className="text-primary">Profesional</span>
            <br />
            Tanpa Ribet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Aplikasi invoice offline-first untuk UMKM, online shop, dan
            freelancer di Indonesia. Lebih profesional dari Excel, lebih simpel
            dari Accurate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Download untuk Windows
            </Button>
            <a href="#features">
              <Button variant="outline" size="lg" className="gap-2">
                Lihat Fitur
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            Gratis. Tanpa iklan. Data tetap di komputer Anda.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground font-medium">
                  Invoice — Dashboard
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Monitor className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-background to-muted/20">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Invoice", value: "156", color: "text-foreground" },
                  { label: "Paid", value: "89", color: "text-green-600" },
                  { label: "Unpaid", value: "52", color: "text-yellow-600" },
                  { label: "Overdue", value: "15", color: "text-red-600" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border bg-card p-4">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg border bg-card p-4 h-48">
                  <p className="text-sm font-medium mb-4">Revenue Bulanan</p>
                  <div className="flex items-end gap-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/10 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4 h-48">
                  <p className="text-sm font-medium mb-4">Status</p>
                  <div className="space-y-3">
                    {[
                      { label: "Draft", count: 8, width: "40%" },
                      { label: "Sent", count: 52, width: "80%" },
                      { label: "Paid", count: 89, width: "100%" },
                      { label: "Overdue", count: 15, width: "25%" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{item.count}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: item.width }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 -z-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -top-4 -left-4 -z-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
