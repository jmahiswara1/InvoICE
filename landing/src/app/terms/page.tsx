import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Invoice",
  description: "Syarat dan ketentuan penggunaan aplikasi Invoice.",
};

const sections = [
  { id: "penerimaan", title: "1. Penerimaan Syarat" },
  { id: "deskripsi", title: "2. Deskripsi Layanan" },
  { id: "akun", title: "3. Akun Pengguna" },
  { id: "lisensi", title: "4. Lisensi Penggunaan" },
  { id: "pembayaran", title: "5. Pembayaran dan Refund" },
  { id: "data", title: "6. Data Pengguna" },
  { id: "tanggung-jawab", title: "7. Pembatasan Tanggung Jawab" },
  { id: "perubahan", title: "8. Perubahan Syarat" },
  { id: "kontak", title: "9. Kontak" },
];

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Terakhir diperbarui: 27 Juni 2026
              </p>
            </div>

            <div className="border-t">
              <section id="penerimaan" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  1. Penerimaan Syarat
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dengan mengunduh, menginstal, atau menggunakan aplikasi Invoice
                  (&ldquo;Aplikasi&rdquo;), Anda setuju untuk terikat oleh Syarat
                  dan Ketentuan ini. Jika Anda tidak setuju, jangan gunakan
                  Aplikasi ini.
                </p>
              </section>

              <section id="deskripsi" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  2. Deskripsi Layanan
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Invoice adalah aplikasi desktop offline-first untuk membuat,
                  mengelola, dan mengirim invoice. Aplikasi ini tersedia dalam
                  versi gratis dan versi berbayar (lisensi satu kali).
                </p>
              </section>

              <section id="akun" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  3. Akun Pengguna
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Untuk menggunakan fitur tertentu, Anda perlu membuat akun. Anda
                  bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi
                  Anda. Anda setuju untuk segera memberi tahu kami tentang
                  penggunaan akun yang tidak sah.
                </p>
              </section>

              <section id="lisensi" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  4. Lisensi Penggunaan
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <div className="pl-4 border-l-2">
                    <p className="font-medium text-foreground mb-1">
                      Versi Gratis
                    </p>
                    <p>
                      Anda mendapatkan lisensi terbatas untuk menggunakan Aplikasi
                      sesuai dengan batasan yang ditetapkan (misalnya, maksimal 5
                      invoice per bulan).
                    </p>
                  </div>
                  <div className="pl-4 border-l-2">
                    <p className="font-medium text-foreground mb-1">
                      Versi Berbayar
                    </p>
                    <p>
                      Setelah pembelian, Anda mendapatkan lisensi permanen untuk
                      menggunakan semua fitur Aplikasi tanpa batasan. Lisensi ini
                      tidak dapat dialihkan ke pihak lain.
                    </p>
                  </div>
                </div>
              </section>

              <section id="pembayaran" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  5. Pembayaran dan Refund
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Pembayaran dilakukan melalui metode yang tersedia di Aplikasi
                    atau website kami. Harga yang tertera belum termasuk pajak
                    yang berlaku.
                  </p>
                  <div className="bg-muted/50 border p-4">
                    <p className="font-medium text-foreground mb-1">
                      Garansi 30 Hari
                    </p>
                    <p>
                      Kami memberikan garansi 30 hari uang kembali. Jika Anda
                      tidak puas, hubungi kami dalam 30 hari setelah pembelian
                      untuk mendapatkan refund penuh.
                    </p>
                  </div>
                </div>
              </section>

              <section id="data" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  6. Data Pengguna
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Anda memiliki semua data yang Anda masukkan ke dalam Aplikasi.
                  Data disimpan secara lokal di perangkat Anda. Kami tidak
                  mengakses, menyimpan, atau menjual data invoice Anda tanpa izin
                  Anda.
                </p>
              </section>

              <section id="tanggung-jawab" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  7. Pembatasan Tanggung Jawab
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Aplikasi ini disediakan &ldquo;apa adanya&rdquo; tanpa jaminan
                  dalam bentuk apa pun. Kami tidak bertanggung jawab atas
                  kerugian langsung, tidak langsung, insidental, atau
                  konsekuensial yang timbul dari penggunaan Aplikasi.
                </p>
              </section>

              <section id="perubahan" className="py-8 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  8. Perubahan Syarat
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke
                  waktu. Perubahan akan diberitahukan melalui Aplikasi atau
                  email. Penggunaan berkelanjutan setelah perubahan dianggap
                  sebagai penerimaan atas syarat yang diperbarui.
                </p>
              </section>

              <section id="kontak" className="py-8">
                <h2 className="text-xl font-semibold mb-4">9. Kontak</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
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
