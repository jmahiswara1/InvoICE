"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
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
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Harga Transparan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Bayar sekali, pakai selamanya. Tanpa langganan bulanan, tanpa biaya
            tersembunyi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div
                className={`relative rounded-xl border bg-card p-8 h-full flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-lg ring-1 ring-primary/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Rekomendasi
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        / {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-start gap-3 text-sm"
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/60"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
