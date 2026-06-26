"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Palette,
  Calculator,
  RefreshCw,
  Download,
  Clock,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Invoice Profesional",
    description:
      "Buat invoice dengan 3 template cantik (Minimalis, Profesional, Kreatif). Export ke PDF langsung.",
  },
  {
    icon: Users,
    title: "Kelola Klien",
    description:
      "Simpan data klien, riwayat invoice, dan cari klien dengan cepat.",
  },
  {
    icon: Calculator,
    title: "PPN & Diskon Otomatis",
    description:
      "Hitung PPN 11%, diskon persen/fixed, dan biaya kirim secara otomatis.",
  },
  {
    icon: RefreshCw,
    title: "Invoice Berulang",
    description:
      "Buat template invoice bulanan/tahunan. Generate otomatis saat jatuh tempo.",
  },
  {
    icon: Clock,
    title: "Reminder Pembayaran",
    description:
      "Notifikasi otomatis untuk invoice yang jatuh tempo atau sudah overdue.",
  },
  {
    icon: Palette,
    title: "Multi-Currency",
    description:
      "Support IDR, USD, EUR, SGD, dan lainnya. Format sesuai locale.",
  },
  {
    icon: Download,
    title: "Import & Export",
    description:
      "Import data dari CSV. Export invoice ke PDF, CSV, atau Excel.",
  },
  {
    icon: Shield,
    title: "Data Aman",
    description:
      "Data tersimpan lokal di komputer Anda. Backup & restore kapan saja.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Semua yang Anda Butuhkan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fitur lengkap untuk mengelola invoice tanpa perlu internet. Dirancang
            khusus untuk UMKM Indonesia.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
