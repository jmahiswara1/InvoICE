"use client";

import { Mail, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const links = {
  product: [
    { label: "Fitur", href: "#features" },
    { label: "Template", href: "#templates" },
    { label: "Harga", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  download: [
    { label: "Windows (.msi)", href: "/download" },
    { label: "Changelog", href: "https://github.com/jmahiswara1/InvoICE/releases" },
  ],
  support: [
    { label: "Email", href: "mailto:support@invoice.gdg.my.id", icon: Mail },
    { label: "WhatsApp", href: "#", icon: MessageCircle },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <a href="#" className="inline-flex items-center gap-2.5 mb-3">
            <img
              src="/logo-black.png"
              alt="InvoICE"
              className="h-6 w-auto dark:hidden"
            />
            <img
              src="/logo-white.png"
              alt="InvoICE"
              className="h-6 w-auto hidden dark:block"
            />
            <span className="font-bold text-sm tracking-[0.2em] uppercase">
              InvoICE
            </span>
          </a>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Aplikasi invoice offline-first untuk UMKM, online shop, dan
            freelancer di Indonesia.
          </p>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">
              Produk
            </h4>
            <ul className="space-y-2.5">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">
              Download
            </h4>
            <ul className="space-y-2.5">
              {links.download.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Invoice. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
