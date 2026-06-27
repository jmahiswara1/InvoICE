import { supabase } from "./supabase";
import { useSettingsStore } from "@/stores/settingsStore";

export interface LicenseInfo {
  key: string;
  user_id: string | null;
  is_active: boolean;
  activated_at: string | null;
}

export const licenseService = {
  async validate(key: string): Promise<{ valid: boolean; message: string; licenseType: "free" | "paid" }> {
    try {
      const { data: license, error } = await supabase
        .from("licenses")
        .select("*")
        .eq("key", key)
        .eq("is_active", true)
        .single();

      if (error || !license) {
        return { valid: false, message: "License key tidak valid atau sudah tidak aktif.", licenseType: "free" };
      }

      // Just validate the key exists and is active
      // Don't update user_id (foreign key constraint)
      useSettingsStore.getState().setLicenseKey(key);
      useSettingsStore.getState().setLicenseType("paid");

      return { valid: true, message: "License berhasil diaktifkan!", licenseType: "paid" };
    } catch (err) {
      console.error("License validation error:", err);
      return { valid: false, message: "Gagal memvalidasi license. Cek koneksi internet.", licenseType: "free" };
    }
  },

  async checkFreeTierLimit(_userId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
    const limit = 5;
    const licenseType = useSettingsStore.getState().licenseType;

    if (licenseType === "paid") {
      return { allowed: true, current: 0, limit: Infinity };
    }

    // For free tier, check local invoice count
    // This is a simplified check - in production, you'd track this in the DB
    return { allowed: true, current: 0, limit };
  },

  async incrementInvoiceCount(_userId: string): Promise<void> {
    // For now, this is a no-op since we're using local storage
    // In production, this would update the server-side count
  },

  getLicenseType(): "free" | "paid" {
    return useSettingsStore.getState().licenseType;
  },

  isPaid(): boolean {
    return this.getLicenseType() === "paid";
  },
};