import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "user" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  initAuthListener: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: async () => {
        localStorage.removeItem("admin_user");
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      checkSession: async () => {
        try {
          // Check admin session first
          const adminUser = localStorage.getItem("admin_user");
          if (adminUser) {
            try {
              const parsed = JSON.parse(adminUser);
              set({
                user: {
                  id: parsed.id,
                  email: parsed.email,
                  name: parsed.name,
                  role: "admin",
                },
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            } catch {
              localStorage.removeItem("admin_user");
            }
          }

          // Check Supabase session
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || "",
                role: "user",
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (err) {
          console.error("Failed to check session:", err);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      initAuthListener: () => {
        supabase.auth.onAuthStateChange((_event, session) => {
          const currentState = get();

          // Don't override admin sessions
          if (currentState.user?.role === "admin") return;

          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || "",
                role: "user",
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        });
      },
    }),
    {
      name: "invoice-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);