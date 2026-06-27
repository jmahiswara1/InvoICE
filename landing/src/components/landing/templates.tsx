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
      <div className="bg-white border p-3 h-full text-[8px] leading-tight dark:bg-card">
        {/* Header */}
        <div className="flex justify-between mb-3">
          <div>
            <div className="h-3 w-16 bg-gray-800 mb-1 dark:bg-gray-200" />
            <div className="h-1.5 w-20 bg-gray-300 dark:bg-gray-600 mb-0.5" />
            <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold tracking-wider mb-1">INVOICE</div>
            <div className="h-1.5 w-20 bg-gray-300 dark:bg-gray-600 ml-auto" />
          </div>
        </div>

        {/* Gray Block */}
        <div className="bg-gray-100 dark:bg-gray-800 p-2 mb-3 flex gap-2">
          <div className="flex-1">
            <div className="h-1 w-12 bg-gray-400 mb-1" />
            <div className="h-1.5 w-16 bg-gray-300 mb-0.5" />
            <div className="h-1 w-20 bg-gray-200" />
          </div>
          <div className="flex-1">
            <div className="h-1 w-12 bg-gray-400 mb-1" />
            <div className="h-1.5 w-14 bg-gray-300 mb-0.5" />
            <div className="h-1 w-18 bg-gray-200" />
          </div>
          <div className="flex-1">
            <div className="h-1 w-12 bg-gray-400 mb-1" />
            <div className="h-1.5 w-16 bg-gray-300 mb-0.5" />
            <div className="h-1 w-12 bg-gray-200" />
          </div>
        </div>

        {/* Table */}
        <div className="border-t border-b mb-3">
          <div className="flex py-1 border-b text-[7px] font-bold text-gray-500">
            <div className="w-[20%]">PROD</div>
            <div className="w-[35%]">DESC</div>
            <div className="w-[10%] text-center">QTY</div>
            <div className="w-[17%] text-right">RATE</div>
            <div className="w-[18%] text-right">AMT</div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex py-1 border-b border-gray-100">
              <div className="w-[20%]"><div className="h-1.5 w-12 bg-gray-300" /></div>
              <div className="w-[35%]"><div className="h-1.5 w-16 bg-gray-200" /></div>
              <div className="w-[10%] text-center">2</div>
              <div className="w-[17%] text-right"><div className="h-1.5 w-8 bg-gray-300 ml-auto" /></div>
              <div className="w-[18%] text-right"><div className="h-1.5 w-10 bg-gray-300 ml-auto" /></div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-3">
          <div className="w-1/2 space-y-0.5">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>175.000</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Diskon</span><span>-10.000</span></div>
            <div className="flex justify-between"><span className="text-gray-500">PPN 11%</span><span>18.150</span></div>
            <div className="border-t pt-1 flex justify-between font-bold"><span>TOTAL</span><span>183.150</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-2 text-[7px] text-gray-400">
          <div className="h-1 w-10 bg-gray-300 mb-1" />
          <div className="h-1 w-32 bg-gray-200" />
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
      <div className="bg-white border overflow-hidden h-full text-[8px] leading-tight dark:bg-card">
        {/* Navy Header */}
        <div className="bg-[#1e3a5f] p-3 mb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-3 w-16 bg-white/80 mb-1" />
              <div className="h-1.5 w-24 bg-white/40 mb-0.5" />
              <div className="h-1 w-20 bg-white/30" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-wider text-white mb-1">INVOICE</div>
              <div className="h-1.5 w-20 bg-white/40 ml-auto" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-3">
          {/* Gray Block */}
          <div className="bg-gray-50 dark:bg-gray-800 p-2 mb-3 flex gap-2">
            <div className="flex-1">
              <div className="h-1 w-12 bg-gray-400 mb-1" />
              <div className="h-1.5 w-16 bg-gray-300 mb-0.5" />
              <div className="h-1 w-20 bg-gray-200" />
            </div>
            <div className="flex-1">
              <div className="h-1 w-12 bg-gray-400 mb-1" />
              <div className="h-1.5 w-14 bg-gray-300 mb-0.5" />
              <div className="h-1 w-18 bg-gray-200" />
            </div>
            <div className="flex-1">
              <div className="h-1 w-12 bg-gray-400 mb-1" />
              <div className="h-1.5 w-16 bg-gray-300 mb-0.5" />
              <div className="h-1 w-12 bg-gray-200" />
            </div>
          </div>

          {/* Table */}
          <div className="border-t border-b mb-3">
            <div className="flex py-1 border-b text-[7px] font-bold text-gray-500">
              <div className="w-[20%]">PROD</div>
              <div className="w-[35%]">DESC</div>
              <div className="w-[10%] text-center">QTY</div>
              <div className="w-[17%] text-right">RATE</div>
              <div className="w-[18%] text-right">AMT</div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex py-1 border-b border-gray-100">
                <div className="w-[20%]"><div className="h-1.5 w-12 bg-gray-300" /></div>
                <div className="w-[35%]"><div className="h-1.5 w-16 bg-gray-200" /></div>
                <div className="w-[10%] text-center">2</div>
                <div className="w-[17%] text-right"><div className="h-1.5 w-8 bg-gray-300 ml-auto" /></div>
                <div className="w-[18%] text-right"><div className="h-1.5 w-10 bg-gray-300 ml-auto" /></div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-3">
            <div className="w-1/2 space-y-0.5">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>175.000</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PPN 11%</span><span>19.250</span></div>
              <div className="bg-[#1e3a5f] text-white p-1.5 mt-1 flex justify-between font-bold">
                <span>TOTAL</span><span>194.250</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#1e3a5f] mx-3 pt-2 text-[7px] text-gray-400">
          <div className="h-1 w-10 bg-gray-300 mb-1" />
          <div className="h-1 w-32 bg-gray-200" />
        </div>
      </div>
    ),
  },
  {
    id: "kreatif",
    name: "Kreatif",
    description: "Modern dengan accent warna. Cocok untuk online shop dan kreatif.",
    features: ["Accent biru", "Layout unik", "Font modern"],
    preview: (
      <div className="bg-white border overflow-hidden h-full text-[8px] leading-tight dark:bg-card">
        {/* Blue Header */}
        <div className="bg-[#2563eb] p-3 mb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-3 w-16 bg-white/80 mb-1" />
              <div className="h-1.5 w-24 bg-white/40 mb-0.5" />
              <div className="h-1 w-20 bg-white/30" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-wider text-white mb-1">INVOICE</div>
              <div className="h-1.5 w-20 bg-white/40 ml-auto" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-3">
          {/* Gray Block with blue accent */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-[#2563eb] p-2 mb-3 flex gap-2">
            <div className="flex-1">
              <div className="h-1 w-12 bg-gray-400 mb-1" />
              <div className="h-1.5 w-16 bg-gray-300 mb-0.5" />
              <div className="h-1 w-20 bg-gray-200" />
            </div>
            <div className="flex-1">
              <div className="h-1 w-12 bg-gray-400 mb-1" />
              <div className="h-1.5 w-14 bg-gray-300 mb-0.5" />
              <div className="h-1 w-18 bg-gray-200" />
            </div>
            <div className="flex-1">
              <div className="h-1 w-12 bg-gray-400 mb-1" />
              <div className="h-1.5 w-16 bg-gray-300 mb-0.5" />
              <div className="h-1 w-12 bg-gray-200" />
            </div>
          </div>

          {/* Table */}
          <div className="border-t-2 border-[#2563eb] border-b mb-3">
            <div className="flex py-1 border-b text-[7px] font-bold text-gray-500">
              <div className="w-[20%]">PROD</div>
              <div className="w-[35%]">DESC</div>
              <div className="w-[10%] text-center">QTY</div>
              <div className="w-[17%] text-right">RATE</div>
              <div className="w-[18%] text-right">AMT</div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex py-1 border-b border-gray-100">
                <div className="w-[20%]"><div className="h-1.5 w-12 bg-gray-300" /></div>
                <div className="w-[35%]"><div className="h-1.5 w-16 bg-gray-200" /></div>
                <div className="w-[10%] text-center">2</div>
                <div className="w-[17%] text-right"><div className="h-1.5 w-8 bg-gray-300 ml-auto" /></div>
                <div className="w-[18%] text-right"><div className="h-1.5 w-10 bg-gray-300 ml-auto" /></div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-3">
            <div className="w-1/2 border-2 border-gray-200 p-2 space-y-0.5">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>175.000</span></div>
              <div className="flex justify-between"><span className="text-gray-500">PPN 11%</span><span>19.250</span></div>
              <div className="border-t-2 border-[#2563eb] pt-1 flex justify-between font-bold text-[#2563eb]">
                <span>TOTAL</span><span>194.250</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#2563eb] mx-3 pt-2 text-[7px] text-gray-400">
          <div className="h-1 w-10 bg-gray-300 mb-1" />
          <div className="h-1 w-32 bg-gray-200" />
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
              <ul className="space-y-2">
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