"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    name: "Minimalis",
    description: "Clean dan sederhana. Cocok untuk freelancer dan agency.",
    colors: ["bg-white", "bg-gray-100", "bg-gray-200", "bg-gray-800"],
    features: ["Putih bersih", "Typography clean", "Layout simpel"],
    preview: (
      <div className="bg-white rounded-md border p-4 h-full text-xs">
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-2 w-16 bg-gray-800 rounded mb-1" />
            <div className="h-1.5 w-24 bg-gray-300 rounded" />
          </div>
          <div className="text-right">
            <div className="h-2 w-12 bg-gray-800 rounded mb-1" />
            <div className="h-1.5 w-16 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="border-t pt-3 mb-3">
          <div className="h-1.5 w-20 bg-gray-300 rounded mb-2" />
          <div className="h-1.5 w-32 bg-gray-200 rounded" />
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between mb-1">
            <div className="h-1.5 w-24 bg-gray-300 rounded" />
            <div className="h-1.5 w-10 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between mb-1">
            <div className="h-1.5 w-20 bg-gray-200 rounded" />
            <div className="h-1.5 w-8 bg-gray-200 rounded" />
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between">
            <div className="h-2 w-12 bg-gray-800 rounded" />
            <div className="h-2 w-14 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Profesional",
    description: "Elegant dengan header biru navy. Cocok untuk perusahaan B2B.",
    colors: ["bg-[#1e3a5f]", "bg-[#2d5a8e]", "bg-[#4a90d9]", "bg-gray-50"],
    features: ["Header biru navy", "Accent biru muda", "Logo placeholder"],
    badge: "Populer",
    preview: (
      <div className="bg-white rounded-md border overflow-hidden h-full">
        <div className="bg-[#1e3a5f] p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-2 w-16 bg-white/80 rounded mb-1" />
              <div className="h-1.5 w-24 bg-white/50 rounded" />
            </div>
            <div className="h-6 w-6 rounded bg-white/20" />
          </div>
        </div>
        <div className="p-4 text-xs">
          <div className="flex justify-between mb-3 text-gray-600">
            <div>
              <div className="h-1.5 w-16 bg-gray-300 rounded mb-1" />
              <div className="h-1.5 w-20 bg-gray-200 rounded" />
            </div>
            <div className="text-right">
              <div className="h-1.5 w-10 bg-gray-300 rounded mb-1" />
              <div className="h-1.5 w-14 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-20 bg-gray-300 rounded" />
              <div className="h-1.5 w-8 bg-gray-300 rounded" />
            </div>
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-16 bg-gray-200 rounded" />
              <div className="h-1.5 w-10 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between">
            <div className="h-2 w-12 bg-[#1e3a5f] rounded" />
            <div className="h-2 w-14 bg-[#1e3a5f] rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Kreatif",
    description: "Gradient ungu-merah muda. Cocok untuk online shop dan kreatif.",
    colors: ["bg-purple-500", "bg-pink-400", "bg-fuchsia-400", "bg-white"],
    features: ["Gradient header", "Rounded corners", "Font modern"],
    preview: (
      <div className="bg-white rounded-md border overflow-hidden h-full">
        <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-2 w-16 bg-white/80 rounded mb-1" />
              <div className="h-1.5 w-24 bg-white/50 rounded" />
            </div>
            <div className="text-right">
              <div className="h-1.5 w-10 bg-white/50 rounded" />
            </div>
          </div>
        </div>
        <div className="p-4 text-xs">
          <div className="flex justify-between mb-3">
            <div>
              <div className="h-1.5 w-16 bg-gray-300 rounded mb-1" />
              <div className="h-1.5 w-20 bg-gray-200 rounded" />
            </div>
            <div className="text-right">
              <div className="h-1.5 w-10 bg-gray-300 rounded mb-1" />
              <div className="h-1.5 w-14 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-20 bg-gray-300 rounded" />
              <div className="h-1.5 w-8 bg-gray-300 rounded" />
            </div>
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-16 bg-gray-200 rounded" />
              <div className="h-1.5 w-10 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between">
            <div className="h-2 w-12 bg-gradient-to-r from-purple-500 to-pink-400 rounded" />
            <div className="h-2 w-14 bg-gradient-to-r from-purple-500 to-pink-400 rounded" />
          </div>
        </div>
      </div>
    ),
  },
];

export function Templates() {
  return (
    <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            3 Template Invoice
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih template yang sesuai dengan bisnis Anda. Semua template bisa
            dikustomisasi dengan logo dan warna.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-[4/3] p-4 bg-muted/20">
                  {template.preview}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    {template.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {template.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex gap-2 mb-4">
                    {template.colors.map((color, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded-full ${color} border`}
                      />
                    ))}
                  </div>
                  <ul className="space-y-2">
                    {template.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-3.5 w-3.5 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
