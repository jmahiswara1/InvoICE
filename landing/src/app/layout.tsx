import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice — Aplikasi Invoice Offline-First untuk UMKM",
  description:
    "Buat invoice profesional tanpa ribet. Lebih profesional dari Excel, lebih simpel dari Accurate. Gratis, offline, tanpa iklan.",
  keywords: [
    "invoice",
    "aplikasi invoice",
    "UMKM",
    "online shop",
    "freelancer",
    "invoice offline",
    "invoice Indonesia",
  ],
  openGraph: {
    title: "Invoice — Aplikasi Invoice Offline-First untuk UMKM",
    description:
      "Buat invoice profesional tanpa ribet. Gratis, offline, tanpa iklan.",
    url: "https://invoice.gdg.my.id",
    siteName: "Invoice",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
