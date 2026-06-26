"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, Monitor, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 uppercase tracking-widest text-xs">
              <WifiOff className="h-3 w-3 mr-1.5" />
              Offline-First
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Buat Invoice
            <br />
            Profesional Tanpa Ribet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
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
          className="mt-20 relative max-w-4xl mx-auto"
        >
          <div className="relative border-2 bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-foreground/20" />
                <div className="w-2.5 h-2.5 bg-foreground/20" />
                <div className="w-2.5 h-2.5 bg-foreground/20" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  Invoice — Dashboard
                </span>
              </div>
              <Monitor className="h-3 w-3 text-muted-foreground" />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Invoice", value: "156" },
                  { label: "Paid", value: "89" },
                  { label: "Unpaid", value: "52" },
                  { label: "Overdue", value: "15" },
                ].map((stat) => (
                  <div key={stat.label} className="border bg-card p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold font-mono mt-1">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 border bg-card p-4 h-44">
                  <p className="text-xs font-medium mb-3 uppercase tracking-wider text-muted-foreground">
                    Revenue Bulanan
                  </p>
                  <div className="flex items-end gap-1.5 h-32">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-foreground/10"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="border bg-card p-4 h-44">
                  <p className="text-xs font-medium mb-3 uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Draft", count: 8, width: "40%" },
                      { label: "Sent", count: 52, width: "80%" },
                      { label: "Paid", count: 89, width: "100%" },
                      { label: "Overdue", count: 15, width: "25%" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-muted-foreground uppercase tracking-wider">
                            {item.label}
                          </span>
                          <span className="font-mono font-medium">
                            {item.count}
                          </span>
                        </div>
                        <div className="h-1 bg-muted overflow-hidden">
                          <div
                            className="h-full bg-foreground"
                            style={{ width: item.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
