import { useEffect, useRef, useState } from "react";
import { syncService, type SyncResult } from "@/lib/syncService";
import { isOnline } from "@/lib/supabase";
import { useSettingsStore } from "@/stores/settingsStore";

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSyncAt = useSettingsStore((s) => s.lastSyncAt);

  const performSync = async () => {
    if (isSyncing) return;
    if (!navigator.onLine) return;

    const online = await isOnline();
    if (!online) return;

    setIsSyncing(true);
    try {
      const result = await syncService.sync();
      setLastSyncResult(result);

      useSettingsStore.getState().setLastSyncAt(new Date().toISOString());

      if (result.errors.length > 0) {
        console.warn("Sync completed with errors:", result.errors);
      }
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Initial sync on mount
    const timeout = setTimeout(performSync, 3000);

    // Periodic sync
    intervalRef.current = setInterval(performSync, SYNC_INTERVAL);

    // Sync on online event
    const handleOnline = () => {
      setTimeout(performSync, 1000);
    };
    window.addEventListener("online", handleOnline);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return {
    isSyncing,
    lastSyncResult,
    lastSyncAt,
    manualSync: performSync,
  };
}