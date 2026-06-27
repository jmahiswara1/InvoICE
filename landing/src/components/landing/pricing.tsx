"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    description: "Untuk memulai dan mencoba fitur dasar.",
    features: [
      { text: "Max 5 invoice/bulan", included: true },
      { text: "1 template (Minimalis)", included: true },
      { text: "Client unlimited", included: true },
      { text: "Export PDF", included: true },
      { text: "Backup & restore lokal", included: true },
      { text: "Multi-currency", included: true },
      { text: "Watermark di invoice", included: false },
      { text: "Template Profesional & Kreatif", included: false },
      { text: "Export CSV & Excel", included: false },
      { text: "Sinkronisasi antar device", included: false },
      { text: "Cloud backup", included: false },
    ],
    cta: "Download Gratis",
    popular: false,
  },
  {
    name: "Lisensi Satu Kali",
    price: "Rp 199.000",
    period: "bayar sekali",
    description: "Unlock semua fitur. Tanpa langganan bulanan.",
    features: [
      { text: "Invoice unlimited", included: true },
      { text: "Semua 3 template", included: true },
      { text: "Client unlimited", included: true },
      { text: "Export PDF, CSV, Excel", included: true },
      { text: "Backup & restore lokal", included: true },
      { text: "Multi-currency", included: true },
      { text: "Tanpa watermark", included: true },
      { text: "Sinkronisasi antar device", included: true },
      { text: "Cloud backup", included: true },
      { text: "Priority support (email/WA)", included: true },
      { text: "Update gratis selamanya", included: true },
    ],
    cta: "Beli Lisensi",
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Harga Transparan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Bayar sekali, pakai selamanya. Tanpa langganan bulanan, tanpa biaya
            tersembunyi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-l-2 border-r border-t border-b">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 border-r last:border-r-0 ${
                plan.popular ? "bg-foreground text-background" : ""
              }`}
            >
              <p
                className={`text-xs uppercase tracking-widest mb-4 ${
                  plan.popular ? "text-background/60" : "text-muted-foreground"
                }`}
              >
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold font-mono">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.popular
                      ? "text-background/60"
                      : "text-muted-foreground"
                  }`}
                >
                  / {plan.period}
                </span>
              </div>
              <p
                className={`text-sm mb-8 ${
                  plan.popular
                    ? "text-background/70"
                    : "text-muted-foreground"
                }`}
              >
                {plan.description}
              </p>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-start gap-3 text-sm"
                  >
                    {feature.included ? (
                      <Check className="h-4 w-4 mt-0.5 shrink-0" />
                    ) : (
                      <X
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          plan.popular
                            ? "text-background/30"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    )}
                    <span
                      className={
                        feature.included
                          ? ""
                          : plan.popular
                          ? "text-background/40"
                          : "text-muted-foreground/50"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "secondary" : "outline"}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
