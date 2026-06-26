import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Invoice",
  description: "Kebijakan privasi aplikasi Invoice.",
};

const sections = [
  { id: "informasi", title: "1. Informasi yang Kami Kumpulkan" },
  { id: "penggunaan", title: "2. Bagaimana Kami Menggunakan Informasi" },
  { id: "penyimpanan", title: "3. Penyimpanan Data" },
  { id: "keamanan", title: "4. Keamanan Data" },
  { id: "berbagi", title: "5. Berbagi Informasi" },
  { id: "hak", title: "6. Hak Anda" },
  { id: "cookie", title: "7. Cookie dan Pelacakan" },
  { id: "anak", title: "8. Privasi Anak" },
  { id: "perubahan", title: "9. Perubahan Kebijakan" },
  { id: "kontak", title: "10. Kontak" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Daftar Isi
              </p>
              <nav className="space-y-1 border-l">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors -ml-px border-l border-transparent"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Terakhir diperbarui: 27 Juni 2026
              </p>
            </div>

            <div className="border-t">
              <section id="informasi" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  1. Informasi yang Kami Kumpulkan
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Kami mengumpulkan informasi berikut saat Anda menggunakan
                  layanan kami:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Informasi Akun",
                      desc: "Nama, email, dan kata sandi saat Anda mendaftar.",
                    },
                    {
                      label: "Data Bisnis",
                      desc: "Nama bisnis, alamat, logo, dan pengaturan lainnya.",
                    },
                    {
                      label: "Data Invoice",
                      desc: "Data klien, item invoice, dan catatan yang Anda buat.",
                    },
                    {
                      label: "Data Penggunaan",
                      desc: "Informasi tentang cara Anda menggunakan Aplikasi.",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="border p-4"
                    >
                      <p className="font-medium text-sm mb-1">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="penggunaan" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  2. Bagaimana Kami Menggunakan Informasi
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="space-y-2">
                  {[
                    "Menyediakan dan memelihara layanan kami.",
                    "Memproses pembelian lisensi dan mengelola akun Anda.",
                    "Mengirimkan pembaruan dan notifikasi penting.",
                    "Meningkatkan dan mengembangkan Aplikasi.",
                    "Menanggapi pertanyaan dan permintaan dukungan.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="font-mono text-xs text-foreground mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="penyimpanan" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  3. Penyimpanan Data
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Data invoice dan klien Anda disimpan secara lokal di perangkat
                  Anda menggunakan SQLite. Kami tidak memiliki akses ke data ini
                  kecuali Anda secara aktif mengaktifkan fitur sinkronisasi cloud.
                  Fitur sinkronisasi cloud menggunakan Supabase sebagai penyedia
                  layanan infrastruktur.
                </p>
              </section>

              <section id="keamanan" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  4. Keamanan Data
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kami menerapkan langkah-langkah keamanan yang wajar untuk
                  melindungi informasi Anda dari akses, perubahan, pengungkapan,
                  atau perusakan yang tidak sah. Namun, tidak ada metode
                  transmisi melalui internet atau penyimpanan elektronik yang 100%
                  aman.
                </p>
              </section>

              <section id="berbagi" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  5. Berbagi Informasi
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kami tidak menjual, memperdagangkan, atau mentransfer informasi
                  pribadi Anda kepada pihak ketiga. Kami dapat berbagi informasi
                  dengan penyedia layanan yang membantu kami mengoperasikan
                  Aplikasi, asalkan mereka setuju untuk menjaga kerahasiaan
                  informasi tersebut.
                </p>
              </section>

              <section id="hak" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">6. Hak Anda</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Anda memiliki hak untuk:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Mengakses data pribadi Anda yang kami simpan.",
                    "Memperbaiki data yang tidak akurat.",
                    "Meminta penghapusan data Anda.",
                    "Menarik persetujuan Anda kapan saja.",
                    "Menonaktifkan akun Anda.",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 border p-3 text-sm text-muted-foreground"
                    >
                      <span className="font-mono text-xs text-foreground mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section id="cookie" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  7. Cookie dan Pelacakan
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Aplikasi desktop kami tidak menggunakan cookie. Website kami
                  (invoice.gdg.my.id) dapat menggunakan cookie dasar untuk
                  fungsionalitas dan analitik. Anda dapat mengatur browser Anda
                  untuk menolak semua cookie.
                </p>
              </section>

              <section id="anak" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  8. Privasi Anak
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13
                  tahun. Kami tidak dengan sengaja mengumpulkan informasi pribadi
                  dari anak-anak di bawah 13 tahun.
                </p>
              </section>

              <section id="perubahan" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  9. Perubahan Kebijakan
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                  waktu. Perubahan akan diberitahukan melalui Aplikasi atau
                  website kami. Kami menyarankan Anda untuk meninjau kebijakan
                  ini secara berkala.
                </p>
              </section>

              <section id="kontak" className="py-8">
                <h2 className="text-xl font-semibold mb-4">10. Kontak</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
                  hubungi kami di{" "}
                  <a
                    href="mailto:support@invoice.gdg.my.id"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    support@invoice.gdg.my.id
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
