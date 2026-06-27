"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-y">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Siap Buat Invoice Profesional?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Download gratis dan mulai buat invoice dalam hitungan menit.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a href="/download">
            <Button size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Download untuk Windows
            </Button>
          </a>
          <a href="#pricing">
            <Button variant="outline" size="lg" className="gap-2">
              Lihat Harga
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
