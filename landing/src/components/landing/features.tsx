"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Calculator,
  RefreshCw,
  Clock,
  Palette,
  Download,
  Shield,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const features = [
  {
    icon: FileText,
    title: "Invoice Profesional",
    description:
      "Buat invoice dengan 3 template cantik (Minimalis, Profesional, Kreatif). Export ke PDF langsung.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Users,
    title: "Kelola Klien",
    description: "Simpan data klien, riwayat invoice, dan cari klien dengan cepat.",
    className: "",
  },
  {
    icon: Calculator,
    title: "PPN & Diskon Otomatis",
    description: "Hitung PPN 11%, diskon persen/fixed, dan biaya kirim otomatis.",
    className: "",
  },
  {
    icon: RefreshCw,
    title: "Invoice Berulang",
    description:
      "Buat template invoice bulanan/tahunan. Generate otomatis saat jatuh tempo.",
    className: "md:col-span-2",
  },
  {
    icon: Clock,
    title: "Reminder Pembayaran",
    description: "Notifikasi otomatis untuk invoice yang jatuh tempo atau overdue.",
    className: "",
  },
  {
    icon: Download,
    title: "Import & Export",
    description: "Import data dari CSV. Export invoice ke PDF, CSV, atau Excel.",
    className: "",
  },
  {
    icon: Palette,
    title: "Multi-Currency",
    description: "Support IDR, USD, EUR, SGD, dan lainnya. Format sesuai locale.",
    className: "",
  },
  {
    icon: Shield,
    title: "Data Aman",
    description:
      "Data tersimpan lokal di komputer Anda. Backup & restore kapan saja.",
    className: "md:col-span-2",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Semua yang Anda Butuhkan"
            description="Fitur lengkap untuk mengelola invoice tanpa perlu internet. Dirancang khusus untuk UMKM Indonesia."
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 border-l border-t"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`border-b border-r p-6 group hover:bg-foreground hover:text-background transition-colors ${feature.className}`}
            >
              <div className="w-10 h-10 border flex items-center justify-center mb-4 group-hover:border-background/30">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground group-hover:text-background/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
