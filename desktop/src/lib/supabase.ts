import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set");
console.log("Supabase Key:", supabaseAnonKey ? "Set" : "Not set");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found in .env file");
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

export async function isOnline(): Promise<boolean> {
  if (!navigator.onLine) return false;
  try {
    // Simple health check - just try to connect
    const { error } = await supabase.from("licenses").select("key").limit(1);
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase connection failed:", err);
    return false;
  }
}