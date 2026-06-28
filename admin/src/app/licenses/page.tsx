"use client";

import { useState, useEffect } from "react";
import { Plus, Copy, CheckCircle, XCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { supabase } from "@/lib/supabase";
import type { AdminLicense } from "@/lib/types";

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<AdminLicense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generateCount, setGenerateCount] = useState(5);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("licenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLicenses(data || []);
    } catch (err) {
      console.error("Failed to load licenses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const newLicenses = [];
      for (let i = 0; i < generateCount; i++) {
        const key = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        newLicenses.push({ key, is_active: true });
      }

      const { error } = await supabase.from("licenses").insert(newLicenses);
      if (error) throw error;

      await loadLicenses();
    } catch (err) {
      console.error("Failed to generate licenses:", err);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await supabase
        .from("licenses")
        .update({ is_active: !currentActive })
        .eq("id", id);

      setLicenses(
        licenses.map((l) =>
          l.id === id ? { ...l, is_active: !currentActive } : l
        )
      );
    } catch (err) {
      console.error("Failed to toggle license:", err);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Licenses</h1>
            <p className="text-muted-foreground">
              Generate and manage license keys.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={generateCount}
              onChange={(e) => setGenerateCount(Number(e.target.value))}
              min={1}
              max={100}
              className="w-20 px-3 py-2 border text-sm outline-none focus:border-foreground"
            />
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Generate
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading licenses...
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No licenses yet. Generate some to get started.
          </div>
        ) : (
          <div className="border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    License Key
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    User ID
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Activated
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr
                    key={license.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{license.key}</span>
                        <button
                          onClick={() => handleCopyKey(license.key)}
                          className="p-1 hover:bg-muted"
                          title="Copy key"
                        >
                          {copiedKey === license.key ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
                          license.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {license.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-mono">
                      {license.user_id || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-muted-foreground">
                      {license.activated_at
                        ? new Date(license.activated_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          handleToggleActive(license.id, license.is_active)
                        }
                        className={`px-3 py-1 text-xs font-medium border transition-colors ${
                          license.is_active
                            ? "text-destructive border-destructive hover:bg-destructive/10"
                            : "text-green-600 border-green-600 hover:bg-green-600/10"
                        }`}
                      >
                        {license.is_active ? "Deactivate" : "Activate"}
                      </button>
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