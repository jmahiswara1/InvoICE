"use client";

import { FileText, Globe, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const links = {
  product: [
    { label: "Fitur", href: "#features" },
    { label: "Template", href: "#templates" },
    { label: "Harga", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  download: [
    { label: "Windows (.msi)", href: "#" },
    { label: "Windows (.exe)", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  support: [
    { label: "Email", href: "mailto:support@invoice.gdg.my.id", icon: Mail },
    { label: "WhatsApp", href: "#", icon: MessageCircle },
  ],
  social: [
    { label: "Website", href: "#", icon: Globe },
    { label: "Blog", href: "#", icon: ExternalLink },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Invoice</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Aplikasi invoice offline-first untuk UMKM, online shop, dan
              freelancer di Indonesia.
            </p>
            <div className="flex gap-3 mt-4">
              {links.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Produk</h4>
            <ul className="space-y-3">
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
            <h4 className="font-semibold text-sm mb-4">Download</h4>
            <ul className="space-y-3">
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
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Invoice. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat dengan ❤️ untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
