"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah bisa dipakai tanpa internet?",
    answer:
      "Ya! Invoice dirancang sebagai aplikasi offline-first. Semua fitur utama (buat invoice, kelola klien, export PDF) bisa dipakai tanpa internet. Fitur online seperti sinkronisasi antar device hanya aktif saat Anda terhubung ke internet.",
  },
  {
    question: "Bagaimana cara install di Windows?",
    answer:
      "Download file installer (.msi atau .exe) dari website ini, lalu jalankan installer-nya. Ikuti wizard instalasi, dan aplikasi akan ter-install di komputer Anda. Prosesnya kurang dari 1 menit.",
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Ya. Data tersimpan secara lokal di komputer Anda menggunakan SQLite. Kami tidak mengakses atau menyimpan data invoice Anda di server. Anda juga bisa melakukan backup manual atau otomatis ke folder Documents.",
  },
  {
    question: "Apa bedanya versi gratis dan berbayar?",
    answer:
      "Versi gratis memiliki limit 5 invoice per bulan dan hanya 1 template (Minimalis). Versi berbayar menghapus semua limit, membuka semua 3 template, menghilangkan watermark, dan menambahkan fitur sinkronisasi antar device serta cloud backup.",
  },
  {
    question: "Bagaimana cara membeli lisensi?",
    answer:
      "Anda bisa membeli lisensi langsung dari aplikasi atau melalui website ini. Pembayaran bisa melalui transfer bank, e-wallet, atau kartu kredit. Setelah pembayaran, license key akan dikirim ke email Anda.",
  },
  {
    question: "Apakah ada refund?",
    answer:
      "Ya. Kami memberikan garansi 30 hari uang kembali. Jika Anda tidak puas dengan produknya, hubungi kami dalam 30 hari setelah pembelian untuk mendapatkan refund penuh.",
  },
  {
    question: "Bisakah dipakai di Mac atau Linux?",
    answer:
      "Saat ini Invoice hanya tersedia untuk Windows. Support untuk Mac dan Linux sedang dalam rencana pengembangan. Subscribe newsletter kami untuk mendapatkan update.",
  },
  {
    question: "Bagaimana cara sync antar device?",
    answer:
      "Fitur sinkronisasi tersedia di versi berbayar. Login dengan akun yang sama di setiap device, dan data akan otomatis tersync saat terhubung ke internet. Konflik data diselesaikan dengan sistem last-write-wins.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Pertanyaan Umum
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Jawaban untuk pertanyaan yang sering ditanyakan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
