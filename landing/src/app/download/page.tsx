import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Monitor, HardDrive, Wifi } from "lucide-react";

export const metadata: Metadata = {
  title: "Download — Invoice",
  description: "Download Invoice aplikasi desktop untuk Windows.",
};

const GITHUB_RELEASE_URL =
  "https://github.com/jmahiswara1/InvoICE/releases/download/v1.0.0/Invoice_1.0.0_x64_en-US.msi";

export default function DownloadPage() {
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Download Invoice
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Aplikasi invoice offline-first untuk UMKM Indonesia.
        </p>

        <div className="border p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Windows (x64)</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Invoice_1.0.0_x64_en-US.msi
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              5.6 MB
            </span>
          </div>

          <a
            href={GITHUB_RELEASE_URL}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download .msi
          </a>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            v1.0.0 &middot; Released 27 Jun 2026
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">System Requirements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border p-4">
              <Monitor className="h-5 w-5 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">OS</p>
              <p className="text-xs text-muted-foreground">
                Windows 10/11 (64-bit)
              </p>
            </div>
            <div className="border p-4">
              <HardDrive className="h-5 w-5 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Disk Space</p>
              <p className="text-xs text-muted-foreground">
                100 MB minimum
              </p>
            </div>
            <div className="border p-4">
              <Wifi className="h-5 w-5 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Internet</p>
              <p className="text-xs text-muted-foreground">
                Not required (offline-first)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold">What&apos;s New in v1.0.0</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              3 invoice templates (Minimalis, Profesional, Kreatif)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              Offline-first with SQLite database
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              Optional cloud sync with Supabase
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              Multi-language support (Indonesian &amp; English)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              Multi-currency support (IDR, USD, EUR, and more)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              CSV/Excel import and export
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              Recurring invoices and payment reminders
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 shrink-0" />
              Dark mode support
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}