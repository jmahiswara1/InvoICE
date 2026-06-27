"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";

export function Header() {
  const { admin } = useAdminAuth();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b bg-card">
      <div>
        <h2 className="text-sm font-semibold">Invoice Admin Panel</h2>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {admin?.email || "Admin"}
        </span>
      </div>
    </header>
  );
}