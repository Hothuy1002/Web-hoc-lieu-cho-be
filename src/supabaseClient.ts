import { createClient } from "@supabase/supabase-js";

// Supabase configuration from Vite env, with fallback to the user's project configurations
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || "https://ghjdqhoxbdaigcyvpnzy.supabase.co";
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoamRxaG94YmRhaWdjeXZwbnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzc3MzEsImV4cCI6MjA5Njc1MzczMX0.dx8NQioJOy5NqpPLIbizjKTeFnhqgIKw-_l-nxD0mHw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utility functions for check and grace fallback
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("kid_profiles").select("id").limit(1);
    if (error) {
      console.warn("Supabase connection warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase connection failed:", err);
    return false;
  }
}
