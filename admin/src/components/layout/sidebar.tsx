"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Key,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Key, label: "Licenses", href: "/licenses" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="h-14 flex items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <span className="font-bold text-sm tracking-wider uppercase">
            Admin Panel
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}