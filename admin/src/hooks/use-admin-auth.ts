"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { AdminUser } from "@/lib/types";

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("admin_user");
      if (stored) {
        setAdmin(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load admin from storage:", err);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        return { success: false, error: `Database error: ${error.message}` };
      }

      if (!data) {
        return { success: false, error: "Email tidak ditemukan." };
      }

      if (data.password_hash !== password) {
        return { success: false, error: "Password salah." };
      }

      const adminUser: AdminUser = {
        id: data.id,
        email: data.email,
        name: data.name,
      };

      window.localStorage.setItem("admin_user", JSON.stringify(adminUser));
      setAdmin(adminUser);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: `Gagal login: ${(err as Error).message}` };
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem("admin_user");
    setAdmin(null);
  }, []);

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
  };
}