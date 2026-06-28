"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/ui/section-header";

const faqs = [
  {
    question: "Apakah bisa dipakai tanpa internet?",
    answer:
      "Ya! Invoice dirancang sebagai aplikasi offline-first. Semua fitur utama (buat invoice, kelola klien, export PDF) bisa dipakai tanpa internet.",
  },
  {
    question: "Bagaimana cara install di Windows?",
    answer:
      "Download file installer (.msi atau .exe) dari website ini, lalu jalankan installer-nya. Prosesnya kurang dari 1 menit.",
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Ya. Data tersimpan secara lokal di komputer Anda menggunakan SQLite. Kami tidak mengakses data invoice Anda di server.",
  },
  {
    question: "Apa bedanya versi gratis dan berbayar?",
    answer:
      "Versi gratis limit 5 invoice/bulan dan 1 template. Versi berbayar unlock semua fitur, hapus watermark, dan tambah sinkronisasi.",
  },
  {
    question: "Bagaimana cara membeli lisensi?",
    answer:
      "Beli lisensi dari aplikasi atau website ini. Bayar via transfer bank, e-wallet, atau kartu kredit. License key dikirim ke email.",
  },
  {
    question: "Apakah ada refund?",
    answer:
      "Ya. Garansi 30 hari uang kembali. Hubungi kami dalam 30 hari setelah pembelian untuk refund penuh.",
  },
  {
    question: "Bisakah dipakai di Mac atau Linux?",
    answer:
      "Saat ini hanya untuk Windows. Support Mac dan Linux sedang dalam rencana pengembangan.",
  },
  {
    question: "Bagaimana cara sync antar device?",
    answer:
      "Fitur sinkronisasi di versi berbayar. Login dengan akun yang sama, data otomatis tersync saat online.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Pertanyaan Umum"
            description="Jawaban untuk pertanyaan yang sering ditanyakan."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-t"
        >
          <div className="border-b border-r">
            <Accordion className="w-full">
              {faqs.slice(0, 4).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                  <AccordionTrigger className="text-left px-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="border-b border-r">
            <Accordion className="w-full">
              {faqs.slice(4).map((faq, index) => (
                <AccordionItem key={index + 4} value={`item-${index + 4}`} className="border-b-0">
                  <AccordionTrigger className="text-left px-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
