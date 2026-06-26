import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="id"
      className={`${plexSans.variable} ${plexMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
