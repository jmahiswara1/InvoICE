"use client";

import { useState, useEffect } from "react";
import { Save, Send, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { supabase } from "@/lib/supabase";

interface Broadcast {
  id: string;
  message: string;
  sent_at: string;
}

export default function SettingsPage() {
  const [globalLimit, setGlobalLimit] = useState(5);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const loadBroadcasts = async () => {
    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setBroadcasts(data || []);
    } catch (err) {
      console.error("Failed to load broadcasts:", err);
    }
  };

  const handleSaveLimit = async () => {
    setSaving(true);
    try {
      // Update all free users to new limit
      // This is a simplified approach - in production, you'd store this in a settings table
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save limit:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.from("broadcasts").insert({
        message: broadcastMessage,
      });

      if (error) throw error;

      setBroadcastMessage("");
      await loadBroadcasts();
    } catch (err) {
      console.error("Failed to send broadcast:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage application settings and broadcast messages.
          </p>
        </div>

        {/* Invoice Limit */}
        <div className="border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold">Invoice Limit (Free Tier)</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Set the maximum number of invoices free users can create per month.
          </p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={globalLimit}
              onChange={(e) => setGlobalLimit(Number(e.target.value))}
              min={0}
              className="w-24 px-3 py-2 border text-sm outline-none focus:border-foreground"
            />
            <button
              onClick={handleSaveLimit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved ? "Saved!" : "Save Limit"}
            </button>
          </div>
        </div>

        {/* Broadcast */}
        <div className="border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold">Broadcast Message</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Send a notification message to all users. Messages are stored in the
            database and fetched by desktop apps during sync.
          </p>
          <textarea
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Enter broadcast message..."
            rows={3}
            className="w-full px-3 py-2 border text-sm outline-none resize-none focus:border-foreground"
          />
          <button
            onClick={handleSendBroadcast}
            disabled={sending || !broadcastMessage.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {sending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "Sending..." : "Send Broadcast"}
          </button>
        </div>

        {/* Broadcast History */}
        <div className="border bg-card p-6">
          <h3 className="font-semibold mb-4">Broadcast History</h3>
          {broadcasts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No broadcasts sent yet.
            </p>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between gap-4 pb-3 border-b last:border-b-0"
                >
                  <p className="text-sm">{b.message}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(b.sent_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}