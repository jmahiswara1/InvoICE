"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin_user");
      }
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

      if (error || !data) {
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

      localStorage.setItem("admin_user", JSON.stringify(adminUser));
      setAdmin(adminUser);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Gagal login. Cek koneksi internet." };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_user");
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