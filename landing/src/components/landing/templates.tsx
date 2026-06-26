"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const templates = [
  {
    id: "minimalis",
    name: "Minimalis",
    description: "Clean dan sederhana. Cocok untuk freelancer dan agency.",
    features: ["Putih bersih", "Typography clean", "Layout simpel"],
    preview: (
      <div className="bg-white border p-4 h-full text-xs dark:bg-card">
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-2 w-16 bg-gray-800 mb-1 dark:bg-gray-200" />
            <div className="h-1.5 w-24 bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="text-right">
            <div className="h-2 w-12 bg-gray-800 mb-1 dark:bg-gray-200" />
            <div className="h-1.5 w-16 bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>
        <div className="border-t pt-3 mb-3">
          <div className="h-1.5 w-20 bg-gray-300 mb-2 dark:bg-gray-600" />
          <div className="h-1.5 w-32 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between mb-1">
            <div className="h-1.5 w-24 bg-gray-300 dark:bg-gray-600" />
            <div className="h-1.5 w-10 bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="flex justify-between mb-1">
            <div className="h-1.5 w-20 bg-gray-200 dark:bg-gray-700" />
            <div className="h-1.5 w-8 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between">
            <div className="h-2 w-12 bg-gray-800 dark:bg-gray-200" />
            <div className="h-2 w-14 bg-gray-800 dark:bg-gray-200" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "profesional",
    name: "Profesional",
    description: "Elegant dengan header gelap. Cocok untuk perusahaan B2B.",
    features: ["Header gelap", "Accent terang", "Logo placeholder"],
    preview: (
      <div className="bg-white border overflow-hidden h-full dark:bg-card">
        <div className="bg-gray-900 p-4 dark:bg-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-2 w-16 bg-white/80 mb-1 dark:bg-black/80" />
              <div className="h-1.5 w-24 bg-white/50 dark:bg-black/50" />
            </div>
            <div className="h-6 w-6 bg-white/20 dark:bg-black/20" />
          </div>
        </div>
        <div className="p-4 text-xs">
          <div className="flex justify-between mb-3 text-gray-600 dark:text-gray-400">
            <div>
              <div className="h-1.5 w-16 bg-gray-300 mb-1 dark:bg-gray-600" />
              <div className="h-1.5 w-20 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="text-right">
              <div className="h-1.5 w-10 bg-gray-300 mb-1 dark:bg-gray-600" />
              <div className="h-1.5 w-14 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-20 bg-gray-300 dark:bg-gray-600" />
              <div className="h-1.5 w-8 bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700" />
              <div className="h-1.5 w-10 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between">
            <div className="h-2 w-12 bg-gray-900 dark:bg-gray-100" />
            <div className="h-2 w-14 bg-gray-900 dark:bg-gray-100" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "kreatif",
    name: "Kreatif",
    description: "Modern dengan border tegas. Cocok untuk online shop dan kreatif.",
    features: ["Border tegas", "Layout unik", "Font modern"],
    preview: (
      <div className="bg-white border-2 border-black overflow-hidden h-full dark:bg-card dark:border-white">
        <div className="border-b-2 border-black p-4 dark:border-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-2 w-16 bg-black mb-1 dark:bg-white" />
              <div className="h-1.5 w-24 bg-gray-400" />
            </div>
            <div className="text-right">
              <div className="h-1.5 w-10 bg-gray-400" />
            </div>
          </div>
        </div>
        <div className="p-4 text-xs">
          <div className="flex justify-between mb-3">
            <div>
              <div className="h-1.5 w-16 bg-gray-300 mb-1 dark:bg-gray-600" />
              <div className="h-1.5 w-20 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="text-right">
              <div className="h-1.5 w-10 bg-gray-300 mb-1 dark:bg-gray-600" />
              <div className="h-1.5 w-14 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-20 bg-gray-300 dark:bg-gray-600" />
              <div className="h-1.5 w-8 bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="flex justify-between mb-1">
              <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700" />
              <div className="h-1.5 w-10 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="border-t-2 border-black mt-2 pt-2 flex justify-between dark:border-white">
            <div className="h-2 w-12 bg-black dark:bg-white" />
            <div className="h-2 w-14 bg-black dark:bg-white" />
          </div>
        </div>
      </div>
    ),
  },
];

export function Templates() {
  const [active, setActive] = useState(0);

  return (
    <section id="templates" className="py-24 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            3 Template Invoice
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Pilih template yang sesuai dengan bisnis Anda. Semua template bisa
            dikustomisasi dengan logo dan warna.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex border-b-2 mb-8">
            {templates.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                  active === i
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-muted/10 border-2 overflow-hidden">
              {templates[active].preview}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">
                {templates[active].name}
              </h3>
              <p className="text-muted-foreground mb-6">
                {templates[active].description}
              </p>
              <ul className="space-y-3">
                {templates[active].features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Check className="h-4 w-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
