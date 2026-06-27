"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Key, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  license_type: string;
  invoice_count_this_month: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLicense = async (userId: string, currentType: string) => {
    const newType = currentType === "paid" ? "free" : "paid";
    try {
      await supabase
        .from("users")
        .update({ license_type: newType })
        .eq("id", userId);

      setUsers(users.map(u => u.id === userId ? { ...u, license_type: newType } : u));
      setActionMenu(null);
    } catch (err) {
      console.error("Failed to update license:", err);
    }
  };

  const handleResetInvoiceCount = async (userId: string) => {
    try {
      await supabase
        .from("users")
        .update({ invoice_count_this_month: 0 })
        .eq("id", userId);

      setUsers(users.map(u => u.id === userId ? { ...u, invoice_count_this_month: 0 } : u));
      setActionMenu(null);
    } catch (err) {
      console.error("Failed to reset invoice count:", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.business_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage registered users.</p>
        </div>

        <div className="flex items-center gap-2 max-w-sm border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Business
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    License
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Invoices
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 text-sm font-mono">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.full_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.business_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
                          user.license_type === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {user.license_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-mono">
                      {user.invoice_count_this_month}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setActionMenu(
                              actionMenu === user.id ? null : user.id
                            )
                          }
                          className="p-1 hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {actionMenu === user.id && (
                          <div className="absolute right-0 top-full mt-1 bg-background border shadow-md z-10 w-48">
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                              onClick={() =>
                                handleToggleLicense(user.id, user.license_type)
                              }
                            >
                              <Key className="h-3.5 w-3.5" />
                              Toggle License ({user.license_type === "paid" ? "to Free" : "to Paid"})
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                              onClick={() => handleResetInvoiceCount(user.id)}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              Reset Invoice Count
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}