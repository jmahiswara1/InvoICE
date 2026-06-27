"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutDialog } from "@/components/layout/logout-dialog";
import { useAuthStore } from "@/stores/authStore";
import { t } from "@/i18n";

const navItems = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard", href: "/" },
  { icon: FileText, labelKey: "nav.invoices", href: "/invoices" },
  { icon: Users, labelKey: "nav.clients", href: "/clients" },
  { icon: RefreshCw, labelKey: "nav.recurring", href: "/recurring" },
  { icon: Settings, labelKey: "nav.settings", href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <aside className="w-64 border-r bg-card flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-2.5 px-4 border-b shrink-0">
          <img src="/logo-black.png" alt="InvoICE" className="h-7 w-auto dark:hidden" />
          <img src="/logo-white.png" alt="InvoICE" className="h-7 w-auto hidden dark:block" />
          <span className="font-bold text-sm tracking-wider uppercase">InvoICE</span>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() => setShowLogout(true)}>
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{t("nav.logout")}</span>
          </Button>
        </div>
      </aside>

      <LogoutDialog
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={logout}
      />
    </>
  );
}